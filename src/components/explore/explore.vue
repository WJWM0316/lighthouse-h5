<template>
  <!-- 朋友圈 首页发现专用 -->
  <div class="explore-list">
    <explore-item v-for="item,index in exploreList"
                  :item="item"
                  :key="index"
                  :isFold="isFold"
                  :itemIndex="index"
                  :hideCommentBtn="hideCommentBtn"
                  :hidePraiseBtn="hidePraiseBtn"
                  :showLightHouseInfo="showLightHouseInfo"
                  :showIdentification="showIdentification"
                  :showDelBtn="showDelBtn"
                  :hideBorder="hideBorder"
                  :hideCommentArea="hideCommentArea"
                  :disableContentClick="disableContentClick"
                  :disableUserClick="disableUserClick"
                  :isDetailCon='isDetailCon'
                  @videoEvent="videoEvent"
                  @operation="operation"
                  ref="dynamic-item"
    ></explore-item>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import exploreItem from '@/components/exploreItem/exploreItem'
  import {setFavorApi, setSubmitCommentApi, delCommontApi, playAudioApi} from '@/api/pages/pageInfo.js'
  import WechatMixin from '@/mixins/wechat'

  @Component({
    name: 'explore-list',
    props: {
      exploreList: {
        type: Array,
        required: true
      },
      // 是否显示折叠功能
      isFold: {
        type: Boolean,
        'default': true
      },
      // 是否隐藏评论按钮
      hideCommentBtn: {
        type: Boolean,
        'default': false
      },
      // 是否隐藏点赞按钮
      hidePraiseBtn: {
        type: Boolean,
        default: false
      },
      // 是否显示社区信息
      showLightHouseInfo: {
        type: Boolean,
        default: false
      },
      // 是否显示标识
      showIdentification: {
        type: Boolean,
        default: false
      },
      // 是否删除按钮
      showDelBtn: {
        type: Boolean,
        default: false
      },
      // 是否隐藏边框
      hideBorder: {
        type: Boolean,
        default: false
      },
      // 是否隐藏评论区域
      hideCommentArea: {
        type: Boolean,
        default: false
      },
      // 禁止内容点击事件
      disableContentClick: {
        type: Boolean,
        default: false
      },
      // 禁止头像名字点击
      disableUserClick: {
        type: Boolean,
        default: false
      },
      // 拦截操作 传入拦截事件名称
      disableOperationArr: {
        type: Array
      },
      isDetailCon: {
        type: Boolean,
        default: false
      }
    },
    components: {
      exploreItem
    },
    watch: {
      exploreList (exploreList) {
        const {item, itemIndex} = this.currentPlay
        if (item.modelType && item.modelType !== exploreList[itemIndex].modelType) {
          console.log('暂停')
          this.music.pause()
        }
      }
    },
    mixins: [WechatMixin]
  })
  export default class exploreList extends Vue {
    currentPlay = {
      item: {},
      itemIndex: -1,
      problemIndex: -1
    }
    music = ''
    currentVideoIndex = -1

    created () {
    }

    mounted () {
    
    }

    videoEvent (e) {
      const {eventType, itemIndex} = e
      if (this.currentVideoIndex > -1) {
        this.exploreList[this.currentVideoIndex].videoPlay = false
        this.$refs['dynamic-item'][this.currentVideoIndex].videoStop()
      }
      const {itemIndex: audioIndex} = this.currentPlay
      switch (eventType) {
        case 'play':
          this.exploreList[itemIndex].videoPlay = true
          this.$refs['dynamic-item'][itemIndex].videoPlay()
          this.currentVideoIndex = itemIndex
          console.log(this.exploreList[itemIndex])
          break
      }
    }

    /**
     * 操作事件
     * @param e :{eventType, itemIndex} eventType: 事件名称 itemIndex: 触发对象下标
     */
    operation (e) {
      const {eventType, itemIndex} = e

      if (this.disableOperationArr && this.disableOperationArr.length > 0) {
        if (this.disableOperationArr.indexOf(eventType) > -1) {
          this.$emit('disableOperationEvents', {
            eventType,
            itemIndex
          })
          return
        }
      }

      const item = this.exploreList[itemIndex]

      switch (eventType) {
        case 'comment':
          break
        case 'praise':
          this.praise({item, itemIndex}).then()
          break
        case 'del':
          this.del({item, itemIndex}).then()
          break
        case 'previewImage':
          this.wechatPreviewImage(e).then()
          break
        case 'fileOpen':
          window.location.href = e.url
          break
      }
    }
    /**
     * 点赞
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async praise ({item, itemIndex}) {
      const {modelType, problemId, circleId, isFavor} = item
      let favorId = circleId || problemId || ''
      let favorType = 0
      switch (modelType) {
        case 'circle':
          favorType = 7
          break
        case 'post':
          favorType = 5
          break
        case 'problem':
          favorType = 4
          break
      }
      const favor = isFavor ? 0 : 1
      const params = {
        favorId,    // 喜爱的id
        favorType,  // 喜爱类型：4问答；5帖子；6评论;7朋友圈；
        isFavor: favor    // 是否喜欢：0取消喜欢，1喜欢
      }

      const res = await setFavorApi(params)

      this.exploreList[itemIndex].isFavor = favor
      this.exploreList[itemIndex].favorTotal += favor ? 1 : -1
      if (favor) {
        this.exploreList[itemIndex].favors = this.exploreList[itemIndex].favors || []
        this.exploreList[itemIndex].favors.splice(0, 0, res)
      } else {
        let tempIndex = ''
        this.exploreList[itemIndex].favors.forEach((item, index) => {
          if (item.userId === res.userId) {
            tempIndex = index
          }
        })
        this.exploreList[itemIndex].favors.splice(tempIndex, 1)
      }
    }
    /**
     * 删除
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async del ({item, itemIndex}) {
      const {modelType, problemId, circleId} = item
      const _this = this
      let id = circleId || problemId || ''
      const params = {
        id,    // 删除id
        modelType,  // 类型：circle:朋友圈,post:帖子,comment:评论
      }

      this.$vux.confirm.show({
        content: '确定要删除吗？',
        confirmText: '确定',
        cancelText: '取消',
        onCancel () {
        },
        onConfirm () {
          delCommontApi(params).then(res => {
            _this.exploreList.splice(itemIndex, 1)
          }).catch(e => {
          })
        }
      })
      console.log(this.exploreList, itemIndex)
    }
  }
</script>
<style lang="less" scoped>
  .explore-list {

    & .video-box {
      position: absolute;
    }
  }
</style>
