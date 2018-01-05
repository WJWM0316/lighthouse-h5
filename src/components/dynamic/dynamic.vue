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
      }
    },
    components: {
      dynamicItem
    }
  })
  export default class dynamicList extends Vue {
    dynamicList = []

    currentPlay = {
      itemIndex: -1,
      problemIndex: -1
    }
    music = ''

    created () {
      this.dynamicList.push({
        circleId: '1233214578321',
        content: '这是一条朋友圈信息 - 纯文本',
        circleType: 0, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        modelType: 'post',
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        Lighthouse: '毛爷爷的社区',
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 1, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 音频1',
        circleType: 1, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        musicState: 0,
        progress: 0,
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 1, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
            fileName: '',
            size: 1000,
            duration: 5,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 音频2',
        circleType: 1, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        musicState: 0,
        progress: 0,
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 1, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
            fileName: '',
            size: 1000,
            duration: 5,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 视频',
        circleType: 2, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 单张大图',
        circleType: 3, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 4格图',
        circleType: 3, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date('2017-12-30').getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 9宫图',
        circleType: 3, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          },
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '',
            size: '',
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        circleId: '',
        content: '这是一条朋友圈信息 - 文件',
        circleType: 4, // 朋友圈资源类型:0.无文件 1.音频 2.视频 3.图片 4.文件
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '习大大',
          avatar: 'http://s9.rr.itc.cn/g/wapChange/201410_30_18/a04wwy792933703305.jpg'
        },
        files: [ // 资源文件
          {
            fileId: '',
            fileUrl: 'http://img.zcool.cn/community/018d4e554967920000019ae9df1533.jpg@2o.jpg',
            fileName: '这是一个pdf文件.pdf',
            size: 1000,
            duration: 10,
            isPlayed: true
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ],
        peoples: [ // 社区同学列表
          {
            userId: '',
            avatar: ''
          }
        ]
      })
      this.dynamicList.push({
        problemId: '',
        content: '黑猫白猫，抓到老鼠就是好猫',
        modelType: 'problem',
        releaseTime: new Date().getTime() / 1000, // 发布时间
        commentTotal: 1, // 评论数量
        favorTotal: 1, // 喜爱数量
        isFavor: 1, // 是否喜爱，1已点击，0未点击
        isSelf: 0, // 是否属于本人：0.不属于；1.属于
        releaseUser: { // 发布人信息
          userId: '111',
          realName: '邓小弟',
          avatar: 'http://i4.itc.cn/20081221/2b4_c48dd548_2ade_4c88_bedb_2ec9f0218d07_0.jpg'
        },
        answers: [ // 资源文件
          {
            answerId: '123',
            answerType: 2,
            type: 2,
            musicState: 0,
            progress: 0,
            content: '是吗?',
            duration: '',
            file: {
              fileId: '',
              fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
              fileName: '',
              size: '',
              duration: 5,
              isPlayed: false
            },
            releaseUser: {
              userId: '110',
              realName: '毛泽东',
              avatar: 'http://img.mp.sohu.com/q_mini,c_zoom,w_640/upload/20170721/2aedb89280c042a182cb56e094461437_th.jpg'
            }
          },
          {
            answerId: '124',
            answerType: 1,
            type: 1,
            content: '不是吗?'
          },
          {
            answerId: '125',
            answerType: 2,
            type: 2,
            musicState: 0,
            progress: 0,
            file: {
              fileId: '',
              fileUrl: 'https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/test/audio/2017-12-23/eef0ca4f7ea5ba00294732fc9a0965a1.mp3',
              fileName: '',
              size: '',
              duration: 5,
              isPlayed: false
            },
            releaseUser: {
              userId: '110',
              realName: '毛泽东',
              avatar: 'http://img.mp.sohu.com/q_mini,c_zoom,w_640/upload/20170721/2aedb89280c042a182cb56e094461437_th.jpg'
            }
          }
        ],
        comments: [ // 评论列表
          {
            userId: '',
            realName: '毛泽东',
            content: '啊啊啊啊',
            isSelf: 0,
            receiver: { // 评论指定回复用户
              userId: '',
              realName: ''
            }
          }
        ],
        favors: [ // 喜爱列表
          {
            userId: '',
            realName: '毛泽东'
          }
        ]
      })
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
      const {itemIndex, problemIndex} = this.currentPlay
      const item = this.dynamicList[itemIndex]

      if (itemIndex < 0) {
        return
      }

      if (item.modelType && item.modelType === 'problem') {
        this.dynamicList[itemIndex].answers[problemIndex].progress = progress || 0
      } else {
        this.dynamicList[itemIndex].progress = progress || 0
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
              console.log('播放')
            } else {
              this.music.pause()
              this.audioStateSet()
              console.log('暂停')
            }
          }
          this.currentPlay = {
            itemIndex,
            problemIndex
          }
          break
      }
    }
  }
</script>

<style lang="less" scoped>
  .m-community {
  }
</style>
