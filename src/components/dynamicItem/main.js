
import Vue from 'vue'
import Component from 'vue-class-component'
import audioBox from '@/components/media/music'
import moment from 'moment'
import { delTopApi, addTopApi   } from '@/api/pages/pageInfo'

@Component({
  name: 'dynamic-item',
  props: {
    //
    isMe: {
      type: String,
    },
    item: {
      type: Object,
      required: true
    },
    isTower: {
      type: Boolean,
      default: false
    },
    isFold: {
      type: Boolean,
      default: true
    },
    // 对象下标
    itemIndex: {
      type: Number
    },
    // 评论总数
    allTotal: {
      type: Number
    },
    isNeedHot: {
      type: Boolean,
      default: false
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
    // 临时下划线取消
    noBorder: {
      type: Boolean,
      default: false
    },
    communityId: {
      type: String,
      default: ''
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
    isDetailCon: {
      type: Boolean,
      default: false
    },
    //是否成员交流。1不是 0 是
    isUserExchange: {
      type: Number,
      default: 1
    },
    //是否塔主
    isMaster: {
      type: Boolean,
      default: false
    },
    //是否显示置顶
    isShowTop: {
      type: Boolean,
      default: false
    }
  },
  components: {
    audioBox
  },
  computed: {
    picList () {
      let list = []
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
    },
    // 获取后缀对应类型
    fileType () {
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
    },
    // 转换字节单位
    byteStr () {
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
  },
  watch: {
    isPlayList () {},
    isTeacherCon () {},
    isTeacher () {},
    isMe(val){
      this.isMe = val
    },
    isUserExchange(val){
      console.log(val)
    },
    isMaster(){},
    isShowTop(val){
      console.log(val)
    }
  }
})
export default class dynamicItem extends Vue {
  video = ''
  role = this.item.releaseUser.role || {}
  type = 0
  created () {
    const {modelType, circleId, problemId, isCanSee, circleType} = this.item
    switch (modelType) {
      case 'circle':
        this.type = 1
        break
      case 'post':
        this.type = 2
        break
      case 'problem':
        this.type = 3
        break
    }
  }
  
  beforeMount(){
  }

  mounted () {
    this.video = this.$refs['video']
  }

  
  
  isFullText (ref) {
    this.$nextTick(() => {
      const el = this.$refs[ref]
      if (el && el.firstChild) {
        const contentText = el.firstChild

        if (contentText.scrollHeight > contentText.offsetHeight) {
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
   * 点击预览图片
   */
  previewImage (img) {
    const files = this.item.files
    let urls = []
    files.forEach((item) => {
      urls.push(item.fileUrl)
    })
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

  op_member(res){
    let menus = []
    let itemIndex = this.itemIndex
    let item = this.item

    console.log('qweqweqweqwe',this.role,this.menus)

    if(this.isMaster){
      if(this.item.topPostStatus == 0){
        menus.push({
          label: '置顶',
          value: '1'
        })
      }else {
        menus.push({
          label: '取消置顶',
          value: '2'
        })
      }
      menus.push({
        label: '删除',
        value: '3'
      })

    }

    if(menus.length>0){
      item.itemIndex = itemIndex
      this.$emit('opMember', {
        item: item,
        menus,
      })
    }
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
  toUserInfo (userId) { // 去个人详情
    if (this.disableUserClick) {
      return
    }
    console.log('去个人详情: ', userId)
    this.$router.push(`/userInfo/${userId}/details`)
  }

  toDetails () { // 去朋友圈、帖子、问题详情
  	console.log(this.$parent,"5555555555555555555")
    if (this.disableContentClick) {
      return
    }
    const item = this.item
    const {modelType, circleId, problemId, isCanSee} = item

    console.log(item)
    return

    if (isCanSee === 0) {
      this.$vux.toast.text('您未加入该灯塔，不能查看。', 'bottom')
      return
    }

    if (this.type) {
      // 跳转详情页 sourceId type
      const sourceId = circleId || problemId
      const communityId = this.communityId
      // this.$router.push({name: 'all-details', params: {sourceId, type}})

      //成员交流详情需要显示操作栏
      let url = ''
      if(this.isUserExchange===0){
        url = `/details/${sourceId}/${this.type}?communityId=${communityId}&isShowOp=${1}`
      }else {
        url = `/details/${sourceId}/${this.type}?communityId=${communityId}`
      }
      this.$router.push(url)
    }
  }

}
