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
                  @audioEvent="audioEvent"
                  @videoEvent="videoEvent"
                  @operation="operation"
    ></dynamic-item>

    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      @send="sendComment"
    ></suspension-input>

    <div class="video-box" ref="video-box">

    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamicItem from '@/components/dynamicItem/dynamicItem'
  import suspensionInput from '@/components/suspensionInput/suspensionInput'
  import {setFavorApi, setSubmitCommentApi, delCommontApi, playAudioApi} from '@/api/pages/pageInfo.js'
  import WechatMixin from '@/mixins/wechat'

  @Component({
    name: 'dynamic-list',
    props: {
      dynamicList: {
        type: Array,
        required: true
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
      dynamicItem,
      suspensionInput
    },
    watch: {
      displaySuspensionInput (val) {
        this.$emit('suspensionInputState', val)
      }
    },
    mixins: [WechatMixin]
  })
  export default class dynamicList extends Vue {
    currentPlay = {
      itemIndex: -1,
      problemIndex: -1
    }
    music = ''
    video = ''

    commentIndex = -1
    suspensionInputPlaceholder = '写评论'
    displaySuspensionInput = false

    created () {
    }

    mounted () {
      const music = new Audio()
      music.autoplay = true

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

      // 创建视频对象
      const video = document.createElement('VIDEO')
      video.autoplay = true
      video.controls = true
      video.addEventListener('fullscreenchange', function(e) {
        const isFullscreen = window.fullScreen || window.document.webkitIsFullScreen || window.document.msFullscreenEnabled
        if (!isFullscreen) {
          video.src = ''
        }
      })
      video.addEventListener('mozfullscreenchange', function(e) {
        const isFullscreen = window.fullScreen || window.document.webkitIsFullScreen || window.document.msFullscreenEnabled
        if (!isFullscreen) {
          video.src = ''
        }
      })
      video.addEventListener('webkitfullscreenchange', function(e) {
        const isFullscreen = window.fullScreen || window.document.webkitIsFullScreen || window.document.msFullscreenEnabled
        if (!isFullscreen) {
          video.src = ''
        }
      })

      this.$refs['video-box'].appendChild(video)
      this.video = video
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
          } else if (temp.modelType === 'problem' && lastProblemIndex !== problemIndex) {
            this.music['src'] = e.url
            this.audioStateSet()
            this.audioProgressSet()
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
            itemIndex,
            problemIndex
          }
          break
      }
    }

    videoEvent (e) {
      const {eventType} = e
      const video = this.video

      switch (eventType) {
        case 'play':
          video.src = e.url
          if (video.requestFullscreen) {
            video.requestFullscreen()
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen()
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen()
          }
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
        const isTrue = this.disableOperationArr.map((typeName) => { return typeName === eventType })
        if (isTrue) {
          this.$emit('disableOperationEvents', {
            eventType
          })
          return
        }
      }

      const item = this.dynamicList[itemIndex]

      switch (eventType) {
        case 'comment':
          this.comment({item, itemIndex}).then()
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
     * 评论
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async comment ({item, itemIndex}) {
      if (item.modelType !== 'circle') {
        this.suspensionInputPlaceholder = '回复' + item.releaseUser.realName + ':'
      }
      this.displaySuspensionInput = true
      this.commentIndex = itemIndex
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

    /**
     * 发送评论
     * @param data
     */
    async sendComment ({value, commentIndex}) {
      const item = this.dynamicList[commentIndex]
      const {problemId, circleId} = item
      let sourceType = 4
      switch (item.modelType) {
        case 'circle':
          sourceType = 1
          break
        case 'post':
          sourceType = 2
          break
        case 'problem':
          sourceType = 3
          break
      }

      const params = {
        sourceId: circleId || problemId,     // 对应评论类型id
        sourceType,   // 评论类型：1.朋友圈；2.帖子；3.提问;4.子评论
        content: value       // 评论内容
      }

      const res = await setSubmitCommentApi(params)

      if (this.dynamicList[commentIndex] && this.dynamicList[commentIndex].comments) {
        this.dynamicList[commentIndex].comments.splice(0, 0, res) // 评价列表已经存在加在尾部
        this.dynamicList[commentIndex].commentTotal += 1
      } else {
        this.dynamicList[commentIndex]['comments'] = [res] // 不存在加一个对象
        this.dynamicList[commentIndex].commentTotal = 1
      }
    }
  }
</script>
<style lang="less" scoped>
  .dynamic-list {

    & .video-box {
      /*position: absolute;*/
    }
  }
</style>
