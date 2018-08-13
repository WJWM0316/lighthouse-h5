
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'
import WechatMixin from '@/mixins/wechat'
import { courseCardFavorApi, courseCardCommentApi } from '@/api/pages/pageInfo'

@Component({
  name: 'lesson-dynamic-item',
  props: {
    item: {
      type: Object,
      required: true
    },
    isFold: {
      type: Boolean,
      default: true
    },
    isNeedHot: {
      type: Boolean,
      default: false
    },
      //是否是课节页面
    isLesson: {
    	type: Boolean,
    	default: true
    },
    // 是否隐藏删除按钮
    showDelBtn: {
      type: Boolean,
      default: false
    },
    // 是否隐藏边框
    hideBorder: {
      type: Boolean,
      default: false
    },
    // 是否隐藏评论区域,详情页时需要隐藏
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
    communityId: {
      type: String,
      default: ''
    }
  },
  computed: {
    picList () {
      let list = []
      const files = this.item.cardContentFile
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
      let releaseTime = this.item.punchCardTime || 0
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
  mixins: [WechatMixin],
})
export default class lessondynamicItem extends Vue {
  video = ''
  role = this.item.releaseUser.role || {}
  type = 0
  created () {
    const {modelType, circleId, circleType} = this.item
    switch (modelType) {
      case 'circle':
        this.type = 1
        break
      case 'post':
        this.type = 2
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
          console.log(el.firstChild)
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
     * 操作事件
     * @param e :{eventType} eventType: 事件名称 itemIndex: 触发对象下标
     */
    operation (e) {
      const {eventType} = e

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

      const item = this.item

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
   * 发表评论
   */
  comment () {
  	if(this.isLesson){
  		this.$router.push({path:'/PunchDetails',query:{courseId:this.item.courseId,peopleId:this.item.peopleId}});
  		return;
  	}
  	
  	let param={
  		peopleCourseId:this.item.courseId, //课节id
  		id:this.item.peopleCourseId,			 //打卡id
  		releaseUser:this.item.releaseUser, //对应打卡信息的个人信息
  		type:1
  	}
  	
		this.$emit('disableOperationEvents', {
      eventType: 'comment',
      param
    })
  	
//	courseCardCommentApi(param).then(res=>{
//		console.log(res,"评论成功")
//	}).catch(res=>{
//		console.log(res,"评论失败")
//	})
  	
  }
  /**
   * 点赞
   */
  praise (courseId,peopleId) {
  	if(this.isLesson){
  		this.$router.push({path:'/PunchDetails',query:{courseId:courseId,peopleId:peopleId}});
  		return;
  	}
  	//点击后的点赞状态
  	let nowFavor = 1
  	if(this.item.isFavor === 0){
  		nowFavor = 1 
  	}else{
  		nowFavor = 0
  	}
  	let parama= {
  		isFavor:nowFavor,
  		type:1,
  		sourceId:this.item.peopleCourseId //打卡信息id
  	}
  	courseCardFavorApi(parama).then(res=>{
  		console.log(res,"打卡成功")
  		this.item.isFavor=nowFavor
  	}).catch(res=>{
  		console.log(res,"打卡失败")
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
    let parma={
    	eventType: 'previewImage',
			urls,
			img
		}
		console.log(parma,"我是图片路径信息")
		this.operation(parma)
  }
  videoClick () {
    if(this.isLesson){
  		this.$router.push(`/PunchList`);
  		return;
  	}
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
   * 编辑
   */
  del () {
  	this.$router.push({path:`/PunchEditing?courseId=${this.communityCourse.id}&communityId=${this.communityCourse.community[0].idKey}`})
//	if(this.isLesson){
//		this.$router.push(`/PunchList`);
//		return;
//	}
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
  	if(this.isLesson){
  		this.$router.push({path:'/PunchDetails',query:{courseId:this.item.courseId,peopleId:this.item.peopleId}});
  		return;
  	}
    if (this.disableContentClick) {
      return
    }
    const item = this.item
    const {modelType, circleId} = item

    if (this.type) {
      // 跳转详情页 sourceId type
      const sourceId = circleId
      const communityId = this.communityId
      // this.$router.push({name: 'all-details', params: {sourceId, type}})
      this.$router.push(`/details/${sourceId}/${this.type}?communityId=${communityId}`)
    }
  }

}
