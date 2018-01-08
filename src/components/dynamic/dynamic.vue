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
                  @operation="operation"
    ></dynamic-item>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamicItem from '@/components/dynamicItem/dynamicItem'

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
      dynamicItem
    },
    watch: {
//      data (data) {
//        const temp = new Array(...data)
//        temp.forEach((item) => {
//          item.musicState = 1
//          item.progress = 50
//        })
//        console.log(temp)
//        this.dynamicList = temp
//      }
    }
  })
  export default class dynamicList extends Vue {

//    dynamicList = []
    currentPlay = {
      itemIndex: -1,
      problemIndex: -1
    }
    music = ''

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

      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          break
        case 'praise':
          // :todo 点赞请求
          const {modelType, problemId, circleId, isFavor, favorTotal} = this.dynamicList[itemIndex]
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
          const params = {
            favorId,    // 喜爱的id
            favorType,  // 喜爱类型：4问答；5帖子；6评论;7朋友圈；
            isFavor: isFavor ? 0 : 1     // 是否喜欢：0取消喜欢，1喜欢
          }

          console.log('点赞参数：', params)
          this.dynamicList[itemIndex].isFavor = isFavor ? 0 : 1
          this.dynamicList[itemIndex].favorTotal += isFavor ? -1 : 1
          break
        case 'del':
          // :todo 删除请求
          this.dynamicList.splice(itemIndex, 1)
          console.log(this.dynamicList, itemIndex)
          break
      }
    }
  }
</script>
<style lang="less" scoped>
  .m-community {
  }
</style>
