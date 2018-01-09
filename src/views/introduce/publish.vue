<template>
  <div class="p-body p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>

    <div class="images" v-if="addonType === 0 || addonType === 3">
      <div class="item" v-for="(item, index) in images" :key="index">
        <image-item class="image" mode="auto" :src="item.path" />
        <button type="button" class="close u-btn" @click="handleDeleteImage(index, item)"><i class="u-icon-delete-image"></i></button>
      </div>
      <a href="#" class="add item" v-if="images.length < lengths.imageMax" @click.prevent.stop="handleAdd"><i class="u-icon-plus"></i></a>
    </div>

    <div class="btn-container">
      <button type="button" class="u-btn-publish" :disabled="!canPublish" @click="handleSubmit">发表</button>
    </div>

    <actionsheet v-model="addActionsConfig.show" :menus="addActionsConfig.menus" :close-on-clicking-mask="false" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import WechatMixin from '@/mixins/wechat'

import { Actionsheet } from 'vux'

@Component({
  name: 'publish-content',
  components: {
    Actionsheet
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
    this.form.communityId = this.$route.communityId
  }

  /**
   * 选择用户图片上传
   */
  async chooseCustomImages () {
    try {
      const params = {
        count: this.lengths.imageMax - this.images.length
      }
      const res = await this.wechatChooseImage(params)
      this.images = res.localIds.map(item => {
        return {
          path: item
        }
      })
      this.uploadCustomImages(res.localIds)
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
        const { serverId } = await this.wechatUploadImage(localId)
        this.serverIds.push(serverId)
      }
      if (localIds && localIds.length > 0) {
        this.uploadCustomImages(localIds)
      } else {
        // todo 全部上传到微信服务器成功，通知服务器
        alert('全部上传到微信服务器成功，通知服务器')
        // this.uploadWechatSuccess()
      }
    } catch (error) {
      this.$vux.toast.text(error.message || '网络异常，请重试')
    }
  }

  /**
   * 删除图片
   */
  handleDeleteImage (index, image) {
    this.images.splice(index, 1)
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
   * 添加图片
   * @param {*} key
   * @param {*} item
   */
  handleAddActoinItem (key, item) {
    switch (key) {
      case 'image':
        this.chooseCustomImages()
        break
      case 'video':
        this.$vux.alert.show({
          title: '小程序',
          content: '小灯塔客服：020-28163063或添加客服微信：zike02',
          buttonText: '好的'
        })
        break
      default:
        break
    }
  }

  /**
   * 提交表单
   */
  handleSubmit (e) {
    this.publish()
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

        & > image {
          width: 40px;
          height: 40px;
          vertical-align: middle;
        }
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

