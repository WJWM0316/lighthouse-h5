
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'
import { courseCardFavorApi, delCourseCardCommentApi } from '@/api/pages/pageInfo'

@Component({
  name: 'discuss-item',
  props: {
    item: {
      type: Object,
      required: true
    },
    commentType: {
      type: String,
      default: 'all'
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
    // 禁止评论区域点击事件
    disableCommentAreaClick: {
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
  watch: {
    item (val) {
      this.role = val.reviewer.role || {}
      console.log(1111, this.role);
    }
  },
  computed: {
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
export default class discussItem extends Vue {
  role = {}
  favorList = "" //点赞列表数据
  created () {
  	if(this.$route.path !== "/PunchDetails"){
	  		this.favorList = this.item.favors
	  	}else{
	  		this.favorList = this.item.favorList
	  	}
  }

  /**
   * 发表评论
   */
  comment () {
    const itemIndex = this.itemIndex
    if(this.$route.path === "/PunchDetails"){
    	this.$emit('operation', {
	      eventType: 'comment',
	      param:{
	      	itemIndex,
		      item: this.item,
		      type: 2
	      }
	    })
    }else{
    	this.$emit('operation', {
	      eventType: 'comment',
	      itemIndex,
	      item: this.item,
	      commentType: this.commentType
	    })
    }
  }
  /**
   * 点赞
   */
  praise () {
    const itemIndex = this.itemIndex
    if(this.$route.path === "/PunchDetails"){
    	let nowFavor;
	    if(this.item.isFavor === 1){
	    	this.item.isFavor = 0
	    	nowFavor = 0
	    }else{
	    	this.item.isFavor = 1
	    	nowFavor = 1
	    }
	    let param= {
	  		isFavor:nowFavor,
	  		type:2,
	  		sourceId:this.item.commentId //打卡信息id
	  	}
	    //发送点赞请求
	    courseCardFavorApi(param).then(res=>{
	    	if(nowFavor === 1){
	    		this.item.favorTotal+=1;
	    		this.item.favorList.push(this.item.currentUser)
	    		this.favorList = this.item.favorList
	    	}else{
	    		this.item.favorTotal-=1;
	    		this.item.favorList.forEach((item, index) => {
	          if (item.userId === this.item.currentUser.userId) {
	            this.item.favorList.splice(index, 1)
	          }
	        })
	    		this.favorList = this.item.favorList
	    	}
	    })

//			this.$emit('operation', {
//		    eventType: 'praise',
//		    param:{
//		    	itemIndex,
//			    item: this.item
//		    }
//		  })
			
    }else{
    	this.$emit('operation', {
		    eventType: 'praise',
		    itemIndex,
		    item: this.item,
		    commentType: this.commentType
		  })
    	if(this.$route.path !== "/PunchDetails"){
	  		this.favorList = this.item.favors
	  	}
    }
    
  }
  /**
   * 删除
   */
  del () {
    const itemIndex = this.itemIndex
    if(this.$route.path === "/PunchDetails"){
    	delCourseCardCommentApi(this.item.commentId).then(res=>{
    		console.log(res,"1111111111111111111")
//  		debugger
    	})
    }else{
    	this.$emit('operation', {
	      eventType: 'del',
	      itemIndex,
	      item: this.item,
	      commentType: this.commentType
	    })
    }
    
  }
  /**
   * 评论区点击
   */
  commentAreaClick () {
    const itemIndex = this.itemIndex
    if(this.$route.path === "/PunchDetails"){
    	this.$emit('operation', {
	      eventType: 'comment-area',
	      param:{
	      	itemIndex,
		      item: this.item,
		      type: this.commentType,
		      commentType: this.commentType
	      }
	    })
    }else{
    	this.$emit('operation', {
      	eventType: 'comment-area',
	      itemIndex,
	      item: this.item,
	      type: this.commentType,
	      commentType: this.commentType
	    })
    }
    
  }

  // -------------------- 页面跳转 ------------------------
  toUserInfo (userId) { // 去个人详情
    if (this.disableUserClick) {
      return
    }
    // userId
    console.log(userId)
    this.$router.push(`/userInfo/${userId}/details`)
  }
  toCommentList (commentId) { // 
    console.log('commentId', this.disableContentClick)
    if (this.disableContentClick) {
      return
    }
    this.$emit('operation', {
      eventType: 'comment',
      itemIndex,
      item: this.item,
      type: this.commentType,
      commentType: this.commentType
    })
  }


}
// http://localhost:8080/?#/index/details/174
// 
// http://localhost:8080/?#/details/577/1
// //http://localhost:8080/?#/reply/1353