<template>
  <div class="p-body p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>

    <div class="images" v-if="addonType === 0 || addonType === 3">
      <div class="item" v-for="(item, index) in images" :key="index">
        <image-item class="image" mode="auto" :src="item.base64Url || item.fileUrl" />
        <button type="button" class="close u-btn" @click="handleDeleteImage(index, item)"><i class="u-icon-delete-image"></i></button>
      </div>
      <a href="#" class="add item" v-if="images.length < lengths.imageMax" @click.prevent.stop="handleAdd"><i class="u-icon-plus"></i></a>
    </div>

    <!-- {{serverIds}}<br>
    {{uploadSuccess}}<br>
    {{images}} -->

    <div class="btn-container">
      <button type="button" class="u-btn-publish" :disabled="!canPublish" @click="handleSubmit">发表</button>
    </div>

    <actionsheet v-model="addActionsConfig.show" :menus="addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
    <wechat-code-modal v-model="wechatCodeModal.show" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import WechatMixin from '@/mixins/wechat'

import { Actionsheet } from 'vux'
import WechatCodeModal from '@/components/wechatCodeModal'

import { publishApi,publishPostApi } from '@/api/pages/content'
import { wechatUploadFileApi } from '@/api/common'

@Component({
  name: 'publish-content',
  components: {
    Actionsheet,
    WechatCodeModal
  },
  mixins: [WechatMixin]
})
export default class PublishContent extends Vue {
  // 文本长度
  lengths = {
    textMax: 1000, // 文本最大字数
    imageMax: 9 // 图片最大张数
  }

  // 选择的图片列表，最多9张
  images = []

  form = {
    communityId: '', // 社区id
    content: '', // 文本内容
  }

  // 添加操作
  addActionsConfig = {
    show: false,
    menus: [
      {
        label: '图片',
        value: 'image'
      },
      {
        label: '视频',
        value: 'video'
      }
    ]
  }

  serverIds = [] // 上传到微信服务器的serverId数组
  uploadSuccess = true

  // 小程序码弹窗
  wechatCodeModal = {
    show: false
  }

  // 图文类型： 0:无文件(文本) 1:音频 2:视频 3:图片
  get addonType () {
    let type = 0
    if (this.images && this.images.length > 0) {
      type = 3
    } else if (this.videos && this.videos.length > 0) {
      type = 2
    } else {
      // 默认0
      type = 0
    }

    return type
  }

  /**
   * 是否可点击发布按钮
   */
  get canPublish () {
    return this.form.content.length > 0 || (this.images && this.images.length > 0)
  }

  created () {
  	console.log(this.$route,"12132132132132132")
    this.form.communityId = this.$route.params.communityId
  }

  /**
   * 选择用户图片上传
   */
  async chooseCustomImages () {
    try {
      const params = {
        count: this.lengths.imageMax - this.images.length
      }
      const { localIds } = await this.wechatChooseImage(params)
      const newImages = []
      for (let index in localIds) {
        const localId = localIds[index]
        const { localData } = await this.wechatGetLocalImgData(localId)
        const item = {
          mediaId: '',
          fileUrl: localId
        }
        if (localData) {
          item.base64Url = localData
        }
        newImages.push(item)
      }
      console.log('newImages:', newImages.map(item => item.base64Url))
      this.images = [...this.images, ...newImages]
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 上传多张图片
   */
  async uploadCustomImages (localIds = []) {
    try {
      const localId = localIds.pop()
      if (localId) {
        this.uploadSuccess = false
        const { serverId } = await this.wechatUploadImage(localId)
        console.log('----', this.images, localId, serverId)
        this.images.forEach(image => {
          if (image.fileUrl === localId) {
            image.mediaId = serverId
          }
        })
        this.serverIds.push(serverId)
        console.log('====', this.images, this.serverIds)
      }

      if (localIds && localIds.length > 0) {
        this.uploadCustomImages(localIds)
      } else {
        // todo 全部上传到微信服务器成功，通知服务器
        await this.uploadWechatSuccess()
        this.uploadSuccess = true
      }
    } catch (error) {
      console.log(error)
      this.$vux.toast.text(error.message || '网络异常，请重试')
    }
  }

  /**
   * 文件成功上传到微信服务器，通知服务器
   */
  async uploadWechatSuccess () {
    try {
      this.serverIds.reverse()
      const params = {
        medias: this.serverIds.map(item => {
          return {
            mediaId: item,
            fileType: 'image'
          }
        }),
        globalLoading: false
      }
      const { files } = await wechatUploadFileApi(params)
      // 成功后，将所有还剩下的图片对象替换
      for (let fileIndex in files) {
        const file = files[fileIndex]
        for (let index in this.images) {
          const image = this.images[index]
          if (image.mediaId === file.mediaId) {
            this.images[index] = file
            break
          }
        }
      }
      this.serverIds = []
      console.log('转换之后images：', this.images)
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 准备发布
   */
  readyPublish () {
    const localIds = this.images.map(item => item.fileUrl) || []
    if (localIds.length > 0) {
      this.uploadCustomImages(localIds)
      this.$vux.loading.show({
        text: '上传中...'
      })
      this.$watch('uploadSuccess', function (val) {
        if (val) {
          this.publish()
        }
      })
    } else {
      this.publish()
    }
    // if (this.uploadSuccess) {
    //   this.publish()
    // } else {
    //   this.$vux.loading.show({
    //     text: '上传中...'
    //   })
    //   this.$watch('uploadSuccess', function (val) {
    //     if (val) {
    //       this.publish()
    //     }
    //   })
    // }
  }

  /**
   * 最终发布
   */
  async publish () {
    try {
      this.$vux.loading.show({
        text: '发布中...'
      })

      let fileId = []
      console.log('准备发布images：', this.images)
      if (this.addonType === 2) {
        fileId = this.videos.map(item => item.fileId)
      } else if (this.addonType === 3) {
        fileId = this.images.map(item => item.fileId)
      }
      console.log('生成的fileId：', fileId)
      const params = {
        communityId: this.form.communityId,
        content: this.form.content,
        type: this.addonType,
        fileId: fileId,
        globalLoading: false
      }

			//判断身份发帖还是发布
			if(this.$route.query.code==='student' || this.$route.query.code==='manager'){
				if(this.$route.query.code==='manager' && this.$route.query.codeType==='1'){
					await publishApi(params)
				}else{
					await publishPostApi(params)
				}
				
			}else{
				await publishApi(params)
			}
      
      this.$vux.toast.text('发布成功', 'bottom')
      this.$router.go(-1)
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    } finally {
      this.$vux.loading.hide()
    }
  }

  /**
   * 预览图片
   */
  handlePreviewImage (image) {
    this.wechatPreviewImage({
      current: image.fileUrl,
      urls: this.images.map(item => item.fileUrl)
    })
  }

  /**
   * 删除图片
   */
  handleDeleteImage (index, image) {
    this.images.splice(index, 1)
    this.serverIds.splice(index, 1)
    if (this.images && this.images.length <= 0) {
      // 如果图片全部删除了，则上传状态变成完成
      this.uploadSuccess = true
    }
  }

  /**
   * 点击添加
   */
  handleAdd () {
    if (this.images && this.images.length <= 0) {
      this.addActionsConfig.show = true
    } else {
      if (this.images.length < this.lengths.imageMax) {
        this.chooseCustomImages()
      }
    }
  }

  /**
   * 点击添加选项item
   * @param {*} key
   * @param {*} item
   */
  handleAddActoinItem (key, item) {
    switch (key) {
      case 'image':
        setTimeout(() => {
          this.chooseCustomImages()
        }, 0)
        break
      case 'video':
        this.wechatCodeModal.show = true
        break
      default:
        break
    }
  }

  /**
   * 提交表单
   */
  handleSubmit (e) {
    const self = this
    this.$vux.confirm.show({
      content: '确定要发布？',
      onConfirm () {
        self.readyPublish()
      }
    })
  }
}
</script>

<style lang="less" scoped>
.p-publish-content {
  padding: 15px;

  .form-group {
    position: relative;
    margin-bottom: 7px;
    padding-bottom: 20px;

    .control {
      width: 100%;
      line-height: 20px;
      font-size: 15px;
      height: 120px;
      border: none;
      resize: none;
    }

    .addon {
      display: block;
      position: absolute;
      right: 0;
      bottom: 0;
      line-height: 20px;
      font-size: 13px;
      color: #bcbcbc;

      &.z-active .current {
        color: #d7ab70;
      }
    }
  }

  .images {
    display: flex;
    margin: 0 -3px -6px;
    flex-flow: row wrap;

    .item {
      position: relative;
      display: block;
      flex: 0 0 auto;
      box-sizing: border-box;
      margin: 0 3px 6px;
      font-size: 0;

      & > .image {
        background: #f1f1f1;
        width: 111px;
        height: 111px;
        line-height: 109px;
      }

      .close {
        position: absolute;
        right: 0;
        top: 0;
        width: 26px;
        height: 26px;
      }

      &.add {
        width: 111px;
        height: 111px;
        line-height: 109px;
        text-align: center;
        border: solid 1px #ededed; /* no */
      }
    }
  }

  .btn-container {
    margin: 40px 10px;

    .u-btn-publish {
      padding: 10px;
      background: #ffe266;
      width: 100%;
      line-height: 24px;
      border-radius: 22px;
      font-size: 15px;
      color: #354048;

      &[disabled] {
        opacity: .5;
      }

      &::after {
        content: none;
      }
    }
  }
}
</style>

