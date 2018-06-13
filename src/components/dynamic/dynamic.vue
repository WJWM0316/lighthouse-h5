<template>
  <!-- 朋友圈 -->
  <div class="dynamic-list">
    <dynamic-item v-for="item,index in dynamicList"
                  :item="item"
                  :key="index"
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
                  :allTotal="allTotal"
                  :isFold="isFold"
                  :touerImg="touerImg"
                  :noBorder="noBorder"
                  :isNeedHot="isNeedHot"
                  :isPlayList='isPlayList'
                  :isTeacher='isTeacher'
                  :isTeacherCon='isTeacherCon'
                  :communityId="communityId"
                  @videoEvent="videoEvent"
                  @operation="operation"
                  ref="dynamic-item"
    ></dynamic-item>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamicItem from '@/components/dynamicItem/dynamicItem'
  import {setFavorApi, setSubmitCommentApi, delCommontApi, playAudioApi} from '@/api/pages/pageInfo.js'
  import WechatMixin from '@/mixins/wechat'

  @Component({
    name: 'dynamic-list',
    props: {
      allTotal: {
        type: Number
      },
      touerImg: {
        type: String,
        default: ''
      },
      dynamicList: {
        type: Array,
        required: true
      },
      isPlayList: {
        type: Boolean,
        default: false
      },
      isTeacher: {
        type: Boolean,
        default: false
      },
      isTeacherCon: {
        type: Boolean,
        default: false
      },
      isFold: {
        type: Boolean,
        default: true
      },
      isNeedHot: {
        type: Boolean,
        'default': false
      },
      // 是否隐藏评论按钮
      hideCommentBtn: {
        type: Boolean,
        'default': false
      },
      // 是否折叠
      isFold: {
        type: Boolean,
        'default': true
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
      // 临时下划线取消
      noBorder: {
        type: Boolean,
        default: false
      },
      communityId: {
        type: String,
        default: ''
      }
    },
    components: {
      dynamicItem
    },
    watch: {
      allTotal (val) {
        this.allTotal = val
      },
      dynamicList (dynamicList) {
        const {item, itemIndex} = this.currentPlay
        if (item.modelType && item.modelType !== dynamicList[itemIndex].modelType) {
          console.log('暂停')
          this.music.pause()
        }
      },
      isPlayList () {},
      isTeacherCon () {},
      isTeacher () {}
    },
    mixins: [WechatMixin]
  })
  export default class dynamicList extends Vue {
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

    destroyed () {
    }



    videoEvent (e) {
      const {eventType, itemIndex} = e
      if (this.currentVideoIndex > -1) {
        this.dynamicList[this.currentVideoIndex].videoPlay = false
        this.$refs['dynamic-item'][this.currentVideoIndex].videoStop()
      }

      const {itemIndex: audioIndex} = this.currentPlay
      if (audioIndex > -1) {
        this.audioEvent({
          eventType: 'pause',
          itemIndex: audioIndex
        })
      }

      switch (eventType) {
        case 'play':
          this.dynamicList[itemIndex].videoPlay = true
          this.$refs['dynamic-item'][itemIndex].videoPlay()
          this.currentVideoIndex = itemIndex
          console.log(this.dynamicList[itemIndex])
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
            itemIndex,
            isDetail: true
          })
          return
        }
      }

      const item = this.dynamicList[itemIndex]

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
      console.log(3333)
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
      if (circleId && !modelType) {
        favorType = 7
      }
      const favor = isFavor ? 0 : 1
      const params = {
        favorId,    // 喜爱的id
        favorType,  // 喜爱类型：4问答；5帖子；6评论;7朋友圈；
        isFavor: favor    // 是否喜欢：0取消喜欢，1喜欢
      }

      const res = await setFavorApi(params)
      this.$emit('getUserId', {res, favor})
      this.dynamicList[itemIndex].isFavor = favor
      this.dynamicList[itemIndex].favorTotal += favor ? 1 : -1
      if (favor) {
        this.dynamicList[itemIndex].favors = this.dynamicList[itemIndex].favors || []
        this.dynamicList[itemIndex].favors.splice(0, 0, res)
      } else {
        let tempIndex = ''
        this.dynamicList[itemIndex].favors.forEach((item, index) => {
          if (item.userId === res.userId) {
            tempIndex = index
          }
        })
        this.dynamicList[itemIndex].favors.splice(tempIndex, 1)
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
            _this.dynamicList.splice(itemIndex, 1)
          }).catch(e => {
          })
        }
      })
      console.log(this.dynamicList, itemIndex)
    }
  }
</script>
<style lang="less" scoped>
  .dynamic-list {

    & .video-box {
      position: absolute;
    }
  }
</style>
