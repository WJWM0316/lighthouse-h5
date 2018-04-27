<template>
  <!-- 朋友圈 -->
  <div class="dynamic-list">
    <dynamic-item v-for="item,index in dynamicList"
                  :item="item"
                  :key="index"
                  :itemIndex="index"
                  :isFold = "isFold"
                  :hideCommentBtn="hideCommentBtn"
                  :hidePraiseBtn="hidePraiseBtn"
                  :showLightHouseInfo="showLightHouseInfo"
                  :showIdentification="showIdentification"
                  :showDelBtn="showDelBtn"
                  :hideBorder="hideBorder"
                  :hideCommentArea="hideCommentArea"
                  :disableContentClick="disableContentClick"
                  :disableUserClick="disableUserClick"
                  @audioEvent="audioEvent"
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
      dynamicList: {
        type: Array,
        required: true
      },
      isFold: {
        type: Boolean,
        default: true
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
      }
    },
    components: {
      dynamicItem
    },
    watch: {
      dynamicList (dynamicList) {
        const {item, itemIndex} = this.currentPlay
        if (item.modelType && item.modelType !== dynamicList[itemIndex].modelType) {
          console.log('暂停')
          this.music.pause()
        }
      }
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
    	console.log("111111113333333333333333333",this.dynamicList)
    }

    mounted () {
      const music = new Audio()

      /**
       * 音频加载中
       */
      music.onloadstart = () => {
        this.audioStateSet('loading')
      }
      /**
       * 可获取音频总时长
       */
      music.ondurationchange = () => {
      }
      /**
       * 缓冲时触发
       */
      music.onprogress = () => {
      }
      /**
       * 音频处于可播放状态
       */
      music.oncanplay = () => {
        this.audioStateSet('playing')
      }
      /**
       * 当媒介能够无需因缓冲而停止即可播放至结尾时运行脚本
       */
      music.oncanplaythrough = () => {
        this.audioStateSet('playing')
      }
      /**
       * 播放中
       */
      music.ontimeupdate = () => {
        let progress = parseInt((music.currentTime / music.duration).toFixed(2) * 100)
        this.audioProgressSet(progress)
      }
      /**
       * 播放完成
       */
      music.onended = () => {
        this.audioStateSet()
        this.audioProgressSet()
      }
      /**
       * 等待数据
       */
      music.onwaiting = () => {
        this.audioStateSet('loading')
      }
      /**
       * 错误
       */
      music.onerror = (e) => {
      }
      this.music = music
    }

    destroyed () {
      this.music.pause()
      this.music.src = ''
      this.music = ''
    }

    /**
     * 设置当前播放状态
     * @param state play | playing | loading
     */
    audioStateSet (state) {
      const {itemIndex, problemIndex} = this.currentPlay
      const item = this.dynamicList[itemIndex]

      if (itemIndex < 0) {
        return
      }

      let musicState = 0
      switch (state) {
        case 'playing':
          musicState = 1
          break
        case 'loading':
          musicState = 2
          break
        default:
          musicState = 0
          break
      }

      if (item.modelType && item.modelType === 'problem') {
        this.dynamicList[itemIndex].answers[problemIndex].musicState = musicState
      } else {
        this.dynamicList[itemIndex].musicState = musicState
      }
    }

    /**
     * 播放进度设置
     */
    audioProgressSet (progress) {
      progress = progress || 0
      console.log(progress)
      const {itemIndex, problemIndex} = this.currentPlay
      const item = this.dynamicList[itemIndex]

      if (itemIndex < 0) {
        return
      }

      if (item.modelType && item.modelType === 'problem') {
        this.dynamicList[itemIndex].answers[problemIndex].progress = progress
      } else {
        this.dynamicList[itemIndex].progress = progress
      }
    }

    audioEvent (e) {
      // 如果播放视频 关闭音频
      if (this.currentVideoIndex > -1) {
        this.dynamicList[this.currentVideoIndex].videoPlay = false
        this.$refs['dynamic-item'][this.currentVideoIndex].videoStop()
      }

      const {eventType, itemIndex, problemIndex} = e
      const temp = this.dynamicList[itemIndex]
      let item = temp
      if (temp.modelType === 'problem') {
        item = temp.answers[problemIndex]
      }
      console.log(eventType, item)

      // 是否听过
      const {isPlayed, fileId} = item.file || item.files[0]
      if (!isPlayed && fileId) {
        playAudioApi({fileId}).then(res => {
          if (temp.modelType === 'problem') {
            this.dynamicList[itemIndex].answers[problemIndex].file.isPlayed = true
          } else {
            this.dynamicList[itemIndex].files[0].isPlayed = true
          }
        })
      }

      switch (eventType) {
        case 'play':
          const {itemIndex: lastItemIndex, problemIndex: lastProblemIndex} = this.currentPlay
          if (lastItemIndex !== itemIndex) {
            this.music['src'] = e.url
            this.audioStateSet()
            this.audioProgressSet()
            this.music.play()
          } else if (temp.modelType === 'problem' && lastProblemIndex !== problemIndex) {
            this.music['src'] = e.url
            this.audioStateSet()
            this.audioProgressSet()
            this.music.play()
          } else {
            console.log(this.music.paused)
            if (this.music.paused) {
              this.music.play()
              this.audioStateSet('playing')
            } else {
              this.music.pause()
              this.audioStateSet()
            }
          }
          this.currentPlay = {
            item,
            itemIndex,
            problemIndex
          }
          break
        case 'pause':
          this.music.pause()
          this.audioStateSet()
          break
      }
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
            itemIndex
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
