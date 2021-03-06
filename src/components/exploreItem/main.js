
import Vue from 'vue'
import Component from 'vue-class-component'
import audioBox from '@/components/media/music'
import moment from 'moment'

@Component({
  name: 'explore-item',
  components: {
    audioBox
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isFold: {
      type: Boolean,
      default: true
    },
    // 对象下标
    itemIndex: {
      type: Number
    },
    // 是否隐藏评论按钮
    hideCommentBtn: {
      type: Boolean,
      default: false
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
    isDetailCon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    picList () {
      let list = []
      if (this.item.files && this.item.files.length>0) {
        const files = this.item.files
        if (files.length === 4) {
          for (let i = 1; i <= files.length; i++) {
            if (i % 3 === 0) {
              list.push({holder: true})
            }
            list.push(files[i - 1])
          }
        } else {
          list = files
        }
        return list
      }
      
    },
    // 获取后缀对应类型
    fileType () {
      if (this.item.files && this.item.files.length>0) {
        const fileName = this.item.files[0].fileName || ''
        let type = 'other'
        if (fileName) {
          // 所有后缀类型
          const fileTypeArr = {
            'pdf': ['pdf'],
            'ppt': ['ppt', 'pptx'],
            'word': ['doc', 'docx'],
            'xls': ['xls', 'xlsx']
          }
          const fileNames = fileName.split('.') // 分割字符串
          const fileSuffix = fileNames[fileNames.length - 1] // 取得后缀
          for (let suffix in fileTypeArr) {
            const suffixs = fileTypeArr[suffix]
            if (suffixs.indexOf(fileSuffix) > -1) {
              type = suffix
              break
            }
          }
        }
        return type
      }
      
    },
    // 转换字节单位
    byteStr () {
      if (this.item.files && this.item.files.length>0) {
        const fileSize = this.item.files[0].size || 0
        let size = 0
        if (fileSize) {
          const company = ['B', 'KB', 'MB']
          for (let index = 0; index < company.length; index++) {
            const sizes = Math.pow(1024, index)
            if (fileSize >= sizes) {
              size = parseInt(fileSize / sizes) + ' ' + company[index]
            }
          }
        } else {
          size = '0 B'
        }
        return size
      }
    },
    // 朋友圈发表时间展示规则
    timeStr () {
      let releaseTime = this.item.releaseTime || 0
      const now = this.serverTime ? new Date(this.serverTime * 1000) : new Date()
      let timeStr = '刚刚'
      if (releaseTime) {
        releaseTime = new Date(releaseTime * 1000)
        let differ = parseInt((now.getTime() - releaseTime.getTime()) / 1000)
        const timeCompany = {
          m: 60,
          h: 60 * 60,
          d: 60 * 60 * 24
        }

        // 是否跨年 and 超过两天
        const nowDate = {
          y: now.getFullYear(),
          m: now.getMonth(),
          d: now.getDate()
        }
        const releaseTimeDate = {
          y: releaseTime.getFullYear(),
          m: releaseTime.getMonth(),
          d: releaseTime.getDate()
        }
        // 是否当天
        if (nowDate.y === releaseTimeDate.y && nowDate.m === releaseTimeDate.m && nowDate.d === releaseTimeDate.d) {
          if (differ < timeCompany.m) { // 一分钟以内
            timeStr = '刚刚'
          } else if (differ < timeCompany.h) { // 一小时以内
            timeStr = parseInt(differ / timeCompany.m) + '分钟前'
          } else {
            timeStr = parseInt(differ / timeCompany.h) + '小时前'
          }
        } else {
          differ = parseInt((new Date(nowDate.y, nowDate.m, nowDate.d).getTime() - releaseTime.getTime()) / 1000)
          if (differ < timeCompany.d) { // 昨天
            timeStr = '昨天'
          } else if (differ < timeCompany.d * 2) {
            timeStr = '前天'
          } else {
            if (now.getFullYear() > releaseTime.getFullYear()) { // 超过两天且跨年
              timeStr = moment(releaseTime).format('YY-MM-DD HH:mm')
            } else {
              timeStr = moment(releaseTime).format('MM-DD HH:mm')
            }
          }
        }
      }
      return timeStr
    }
  }
})
export default class exploreItem extends Vue {
  video = ''
  role = this.item.releaseUser.role || {}
  created () {
  }

  mounted () {
    this.video = this.$refs['video']
  }

  isFullText (ref) {
    this.$nextTick(() => {
      const el = this.$refs[ref]
      if (el&&el.firstChild) {
        const contentText = el.firstChild
        if (contentText.scrollHeight-10 > contentText.offsetHeight) {
          console.log(contentText.scrollHeight, contentText.offsetHeight)
          const fullText = document.createElement('span')
          fullText.className = 'full-text open'
          fullText.innerText = '展开全文'
          fullText.onclick = (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (fullText.innerText === '展开全文') {
              contentText.classList.remove('ellipsis')
              fullText.innerText = '收起全文'
              fullText.className = 'full-text close'
            } else {
              fullText.innerText = '展开全文'
              contentText.classList.add('ellipsis')
              fullText.className = 'full-text open'
            }
          }
          el.lastChild.innerHTML = ''
          el.lastChild.appendChild(fullText)
        }
      }

      
    })
  }

  /**
   * 发表评论
   */
  comment () {
    const itemIndex = this.itemIndex
    this.$emit('operation', {
      eventType: 'comment',
      itemIndex
    })
  }
  /**
   * 点赞
   */
  praise () {
    const itemIndex = this.itemIndex
    this.$emit('operation', {
      eventType: 'praise',
      itemIndex
    })
  }
  /**
   * 播放对应音频
   */
  audioPlay (problemIndex) {
    let url = ''
    const itemIndex = this.itemIndex
    if (problemIndex >= 0) {
      url = this.item.answers[problemIndex].file.fileUrl
    } else {
      url = this.item.files[0].fileUrl
    }

    this.$emit('audioEvent', {
      eventType: 'play',
      url,
      itemIndex,
      problemIndex
    })
  }
  /**
   * 点击预览图片
   */
  previewImage (img) {
    const files = this.item.files
    let urls = []
    files.forEach((item) => {
      urls.push(item.fileUrl)
    })
    console.log('当前图片: ', img, '图片数组: ', urls)

    this.$emit('operation', {
      eventType: 'previewImage',
      img,
      urls
    })
  }
  /**
   * 打开文件
   */
  fileOpen (url) {
    console.log('当前打开文件: ', url)
    this.$emit('operation', {
      eventType: 'fileOpen',
      url
    })
  }
  videoClick () {
    const itemIndex = this.itemIndex
    this.$emit('videoEvent', {
      eventType: 'play',
      itemIndex
    })
  }
  videoPlay () {
    this.video.currentTime = 0
    this.video.src = this.item.files[0].fileUrl
    this.video.play()
  }

  videoStop () {
    this.video.pause()
    this.video.src = ''
  }

  /**
   * 删除
   */
  del () {
    const itemIndex = this.itemIndex
    this.$emit('operation', {
      eventType: 'del',
      itemIndex
    })
  }

  // -------------------- 页面跳转 ------------------------
  toUserInfo () { // 去社区详情
    if (this.disableUserClick) {
      return
    }
    this.toCommunity()
  }
  toDetails ({to}) { // 发现内容详情
    if (this.disableContentClick) {
      return
    }
    if (to && to === 'praise') {
      this.$router.push(`/index/details/${this.item.circleId}/?target=praise&modeType=${this.item.modelType}`)
    } else {
      this.$router.push(`/index/details/${this.item.circleId}?modeType=${this.item.modelType}`)
    }
  }
  toPerson () {
    this.$router.push(`/userInfo/${userId}/details`)
  }
  toCommunity () { // 去大咖介绍页
    const {community} = this.item
    this.$router.push(`/introduce/${community.communityId}`)

  }
}
