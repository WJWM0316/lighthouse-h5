<template>
	<!--课节页面-->
	<div class="Lesson" v-if="communityCourse">
		<!--头部图片标题区-->
		<div class="Lesson-header">
			<img class="header-photo" :src="communityCourse.coverPicture"/>
			<div class="header-title">
				{{communityCourse.title}}
			</div>
		</div>
		<!--富文本区-->
		<div class="Lesson-module">
      <div class="module-header">
      	<div class="head-photobox">
      		<img :src="communityCourse.people.avatar"/>
      		<span class="name">{{communityCourse.people.realname}}</span>
      	</div>
      	<div class="date">{{communityCourse.createTime*1000 | date('YYYY-MM-DD')}}</div>
      </div>
      <!--视频-->
      <div class="Lesson-video" @click.stop="playVideo($event)" v-if="communityCourse.av && communityCourse.av.type==='video'">
      	<video controls ref="video" v-show="!videoPlay"></video>
      	<div class="placeholder" v-show="videoPlay">
          <!--背景图-->
          <!--<img />-->
        </div>
      </div>
      <!-- 音频 -->
      <div :class="{'content-audio': true, 'not-played': !communityCourse.av.files[0].isPlayed}" v-if="communityCourse.av && communityCourse.av.type==='audio'">
        <audioBox
          :source="communityCourse.av.files[0]" 
          :touerImg="communityCourse.av.avatarUrl"
          :isDetailCon='false'
          :isLesson = 'true'
        ></audioBox>
      </div>
      <div class="module-content h5-code" @click.stop="readPic($event)" v-html="communityCourse.details" ref="H5">
      </div>
    </div>

    <!-- 已加入 -->
		<template v-if="lessonData && isJoinAgency">
		    <!--本节任务-->
				<div class="Lesson-task" v-if="trialReading === '0' && (communityCourse.punchCardTitle || communityCourse.punchCardImgInfo.length>0)">
					<!--头部标题-->
					<div class="headerBox">
						<div class="title-pic1">
							<span class="txt">本节打卡任务</span>
						</div>
						<div class="title-pic2"></div>
					</div>
					<!--头部标题-->
					<pre class="content-txt" v-html="communityCourse.punchCardTitle">
					</pre>
					<div class="content-img">
						<!--<img v-for="item in community_course.punch_card_img_info" :src="item.picture_url" alt="" />-->
						<div class="content-images">
		          <!-- 图片为 1 张时 -->
		          <div class="item-image one" v-if="communityCourse.punchCardImgInfo && communityCourse.punchCardImgInfo.length>0 && communityCourse.punchCardImgInfo.length === 1">
		            <img :src="communityCourse.punchCardImgInfo[0].pictureUrl || '../../assets/icon/img_head_default.png'" @click.stop="previewImage(communityCourse.punchCardImgInfo[0].pictureUrl)" />
		          </div>

		          <!--  图片为 多 张时  -->
		          <div class="item-image" v-for="(file, index) in communityCourse.punchCardImgInfo" :key="index" v-else>
		            <img :src="file.pictureUrl || '../../assets/icon/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.pictureUrl)" />
		          </div>
		        </div>
					</div>
				</div>
				<!--本节任务结束-->
				<!--优秀打卡区-->
				<div class="Lesson-punch" v-if="trialReading === '0'">
					<!--头部标题-->
					<div class="headerBox" v-if="(excellentPunchList && excellentPunchList.length>0) || (peopleCourseCardList && peopleCourseCardList.length>0)">
						<div class="title-pic1">
							<span class="txt">打卡区</span>
						</div>
						<div class="title-pic2"></div>
					</div>
					<!--优秀头部标题图片-->
					<div class="excellentPunchList"  v-if="excellentPunchList && excellentPunchList.length>0">
						<div class="Excellent-punch">
							<div class="Excellent-punch-title">优秀打卡</div>
						</div>
						<div class="hr"></div>
						<!--优秀打卡内容区-->
						<lessondynamicItem
							 v-for="(item, index) in excellentPunchList"
							 :key = "index"
							 :item="item"
			         :showDelBtn="true"
			         :communityId="communityId"
			         :isFold="true"
			         :isNeedHot="true"
			         :hideBorder="false"
			         :isLesson="true"
			         :disableContentClick="false"
			         @disableOperationEvents="operation"
			         @reFresh="reFresh"
			         @showEvaluate='showEvaluate'
			      ></lessondynamicItem>
			      <div class="Expand-btn" @click.stop="toPunchList('excellent')" v-if="countCardInfo.totalExcellentCardCount>5">
			      	<div @click.stop="toApp">
			      		打开App，查看所有优秀打卡 <!--<span>({{countCardInfo.totalExcellentCardCount}})</span>-->
			      	</div>
			      </div>
					</div>
					
				</div>
				<!--所有打卡区-->
				<div class="all-punch" v-if="trialReading === '0' && peopleCourseCardList && peopleCourseCardList.length>0">
					<div class="Excellent-punch">
						<div class="Excellent-punch-title">所有打卡</div>
					</div>
					<div class="hr"></div>
					<lessondynamicItem
						 v-for="(item, index) in peopleCourseCardList"
						 :key = "index"
						 :item="item"
		         :showDelBtn="true"
		         :communityId="communityId"
		         :isFold="true"
		         :isNeedHot="true"
		         :hideBorder="false"
		         :isLesson="true"
		         :disableContentClick="false"
		         @disableOperationEvents="operation"
		         @reFresh="reFresh"
		         @showEvaluate='showEvaluate'
		      ></lessondynamicItem>
		      <div class="Expand-btn all-show" @click.stop="toPunchList('all')" v-if="countCardInfo.totalCardCount>5">
		      	<div @click.stop="toApp">
		      		打开App，查看所有打卡 <!--<span>({{countCardInfo.totalCardCount}})</span>-->
		      	</div>
		      </div>
				</div>
				
				<!--底部打卡按钮区-->
				<!--<div v-if="trialReading === '0' || (curPeopleInfo.roleId!==1 && curPeopleInfo.roleId!==2) || curPeopleInfo.roleId">-->
				<div v-if="curPeopleInfo.roleId!==1 && curPeopleInfo.roleId!==2 && trialReading === '0'">
					<div class="Lesson-footer" v-if="isPunch === 0">
						<div class="toPunch" @click.stop="toPunch">
							打卡做任务，解锁下一节课
						</div>
					</div>
					<div class="Lesson-footer" v-else>
							<div class="peacock" @click.stop="toPoster()">炫耀一下</div><span class="line"></span>
							<div class="mine" @click.stop="toMindDetail(communityCourse.peopleId,communityCourse.id)">我的打卡</div>
					</div>
				</div>
		</template>
    <!-- 未加入 -->
		<payment v-else :pageInfo="lessonData" :isPassTime="isPassTime" @payOrFree="payOrFree" @freeJoin="freeJoin" @freeIn="freeIn"></payment>
		<actionsheet v-model="addActionsConfig.show" :menus="isExcellentCard?addActionsConfig.menus2:addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />

		<hint-msg 
		  :isHintShow = isHintShow 
		  :msg = hintData
		  :type = 2
		  @cloHint = cloHint
		  @hintSucFuc = hintSucFuc
		></hint-msg>

		<!--支付弹窗-->
		<div class="pay_window" v-if="toPay" @click="closePya">
			<div class="pay_box" @click.stop="showPayWindow">
				<h3>{{lessonData.title}}</h3>
				<div class="tip">成功付款后，就可以开始你的职场提升之路了~</div>
				<div class="price">
					<span>社区价格</span>
					<span>¥ {{lessonData.joinPrice}}</span>
				</div>
				<div class="coupon_price" @click.stop="toCoupon">
					<span>优惠券</span>
					<div class="coupon_price_right">
						<span v-if="selectCouponItem.userCouponId && selectCouponItem.userCouponId!==0">-¥ {{selectCouponItem.coupon.discount>lessonData.joinPrice?lessonData.joinPrice:selectCouponItem.coupon.discount}}</span>
						<span v-else-if=" lessonData.selectCoupon!==null && selectCouponItem.userCouponId===0 ">不使用优惠券</span>
						<span v-else-if=" lessonData.selectCoupon===null ">无可用优惠券</span>
						<span v-else>-¥ {{lessonData.selectCoupon.userCoupon.coupon.discount>lessonData.joinPrice?lessonData.joinPrice:lessonData.selectCoupon.userCoupon.coupon.discount}} </span>
						<div class="more_coupon"></div>
					</div>
				</div>
				<div class="payment">
					<div class="payment_num">
						实付：<span>¥</span>
						<!--选择其他优惠券-->
						<span v-if="selectCouponItem.userCouponId && selectCouponItem.userCouponId!==0">{{selectedPrice}}</span>
						<!--不使用优惠券和无优惠券-->
						<span v-else-if=" lessonData.selectCoupon===null || selectCouponItem.userCouponId===0 ">{{lessonData.joinPrice}}</span>
						<!--使用默认优惠券-->
						<span v-else>{{lessonData.selectCoupon.couponPrice}}</span>
					</div>
					<div class="payment_btn" @click.stop="isPay">立即支付</div>
				</div>
			</div>
		</div>
		<div class="posterBox" v-if="showPost && isPunch !== 0" @click.stop="close">
		  <poster :name="curPeopleInfo.userInfo.realname" :title="communityCourse.title" @close="close"></poster>
		</div>
		<!--加入训练营弹窗-->
    <div class="trainingCampAlert" v-if="trainingCampAlert" @click.stop="close">
      <div class="content" v-if="pageInfo.alterWechatQrcode" @click.stop="">
        <img class="closeBtn" src="../../assets/icon/icon-close.png" alt="" @click.stop="close" />
        <h3>恭喜你加入训练营</h3>
        <p>{{pageInfo.alterTxt}}</p>
        <img :src="pageInfo.alterWechatQrcode" alt="" />
        <span>长按保存二维码</span>
        <div class="copy" @click.stop="copy($event)">复制微信号</div>
      </div>
      <div class="textContent" @click.stop="" v-else>
        <img class="closeBtn" src="../../assets/icon/icon-close.png" alt="" @click.stop="close" />
        <h3>恭喜你加入训练营</h3>
        <span id="copy">请添加客服微信：{{pageInfo.consultantCustomerWechat}}</span>
        <div class="copy" @click.stop="copy">复制微信号</div>
      </div>
    </div>
	</div>
</template>

<script>
	import Vue from 'vue'
  import Component from 'vue-class-component'
	import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
  import hintMsg from '@/components/hintMsg/hintMsg'
  import audioBox from '@/components/media/music'
  import WechatMixin from '@/mixins/wechat'
  import appGuide from '@/util/appGuide'
  import poster from '@/components/poster/poster'
  import payment from '@/components/payment/payment'
  import { Actionsheet } from 'vux'
  import { lessonContentApi, getCourseCardListApi, setExcellentCourseCardApi } from '@/api/pages/pageInfo'
  import {payApi, freePay} from '@/api/pages/pay'
  Component.registerHooks([
	  'beforeRouteEnter',
	  'beforeRouteLeave',
	  'beforeRouteUpdate' // for vue-router 2.2+
	])
  @Component({
    name: 'Lesson',
    components: {
      lessondynamicItem,
      hintMsg,
      audioBox,
      Actionsheet,
      poster,
      payment
    },
    computed: {
    	// 剩余免费名额
    	freeSurplusPeople () {
    	  let n = parseInt(this.lessonData.freeJoinNum) - parseInt(this.lessonData.freeJoinedNum)
    	  return n
    	},
    	// 剩余付费名额
    	paySurplusPeople () {
    	  let n = parseInt(this.lessonData.payJoinNum) - parseInt(this.lessonData.payJoinedNum)
    	  return n
    	},
    	// 是否已入社
    	isJoinAgency () {
    	  return this.lessonData.isAuthor || this.lessonData.isJoined
    	},
    	// 是否已结束
    	isEnd () {
    	  let {serverTime, endTime} = this.lessonData
    	  return new Date(serverTime) > new Date(endTime)
    	},
    	isFreeBtn () {
    	  return this.freeSurplusPeople > 0
    	},
    	isPayBtn () {
    	  return this.paySurplusPeople > 0
    	},
    	/* 是否错过训练营可加入时间 */
      isPassTime () {
        let {startTime, endTime} = this.lessonData
        let timestamp = Date.parse(new Date())
        return timestamp > startTime*1000
      }
    },
    watch: {
    },
    mixins: [WechatMixin],
  })
  export default class Lesson extends Vue {
  	video = '' //视频
  	videoPlay = true //视频是否在播放
  	showIdentification = true
    disableOperationArr = ['comment']
    isPlayList = false
    //所有打卡数据
    peopleCourseCardList = ""
    //优秀打卡
    excellentPunchList = ""
    //是否试读
    trialReading = 0 //0是非试读， 1是试读
    //最新课节信息
    communityCourse = ''
    communityId = ""
  	isPunch = 0	//是否已经打卡0:是未打卡，1是打卡
  	curPeopleInfo = ""
  	countCardInfo = ""
  	isExcellentCard = 0 //是否优秀打卡，0：不是，1是优秀
  	
  	optPunch = '' //当前要评选的打卡信息
	  // 选为优秀打卡或取消优秀打卡
		addActionsConfig = {
			show: false,
			menus: [{
					label: '选为优秀打卡',
					value: 'selected'
				}
			],
			menus2:[{
					label: '取消优秀打卡',
					value: 'disSelect'
				}
			]
		}
		trainingCampAlert = false //加入训练营弹窗开关

  	//试读。未加入相关
  	lessonData = {}
  	events = {}

  	usedUserCouponId = 0    //支付时使用的优惠券id
  	selectCouponItem = {}   //当前选择的优惠券信息
  	selectedPrice = ''    //选择其他优惠券后的价格
  	toPay = false     //是否调起支付窗口

  	isHintShow = false   //弹窗
  	hintData = {
  	  title: '加入须知',
  	  buttonText: '马上加入',
  	  cancelText: '我再想想',
  	  content: [
  	    '该课程已经全部更新完毕了！',
  	    '加入后你获得以下内容：',
  	    '1、塔主课程以及小伙伴们沉淀 下来的宝贵内容；',
  	    '2、和成员们一起交流学习；',
  	    '3、提问导师或嘉宾，但不一定 能100%得到回答'
  	  ]
  	}
    endPayType = null //已结束 加入时候的状态
    showPost = false

  	created(){
  		this.trialReading = this.$route.query.isTry
			//初始化
			this.init()
  	}

  	
  	//路由进入
  	beforeRouteEnter(to,from,next){
  		next();
  	}
  	
  	toApp () {
  	  let path = `ttbeacon://app:8080/launcher%3Ft%3D2%26id%3D${this.$route.query.communityId}`
  	  appGuide.isToApp(false, path)
  	}
  	
  	//初始化函数
  	/*
		 *lessonContentRes:课节详情接口返回
		 * CourseCardListRes:打卡列表接口返回
		 */
  	async init(){

			let that = this
  		let parama = {
  			communityId:this.$route.query.communityId,
  			courseId:this.$route.query.id,
  			type:0,
  			page:0,
  			pageCount:0
  		}

			this.communityId = this.$route.query.communityId
  		try{
  			const [lessonContentRes,CourseCardListRes] = await Promise.all([lessonContentApi(this.$route.query.id),getCourseCardListApi(parama)])
  			this.lessonData = lessonContentRes.couponInfo	//优惠券信息
  			this.communityCourse = lessonContentRes.communityCourse //课节详情信息
  			this.countCardInfo = lessonContentRes.countCardInfo	//课节个人打卡信息
  			if(lessonContentRes.communityCourse.avId){	//课节媒体信息
  				this.communityCourse.av.files[0].fileId = String(lessonContentRes.communityCourse.av.files[0].fileId)
  			}
  			this.isPunch = lessonContentRes.peopleCardInfo.isPunchCard
  			this.curPeopleInfo = lessonContentRes.curPeopleInfo	//课节个人信息
  			this.peopleCourseCardList = CourseCardListRes.peopleCourseCardList.length>0?CourseCardListRes.peopleCourseCardList:""//打卡列表
  			this.excellentPunchList = CourseCardListRes.excellentPeopleCourseCardList.length>0?CourseCardListRes.excellentPeopleCourseCardList:""//优秀打卡列表
  			
  			//是否调起支付
	  		let Selectcoupon=sessionStorage.getItem("coupon");
	  		if(Selectcoupon){
	  			this.toPay = true;
	  			let CouponItem = sessionStorage.getItem("coupon");
	  			this.selectCouponItem = JSON.parse(CouponItem);
	  			if(this.selectCouponItem.userCouponId!==0){
	  				let paynum=this.lessonData.joinPrice-this.selectCouponItem.coupon.discount;
	  				this.selectedPrice = this.lessonData.joinPrice>this.selectCouponItem.coupon.discount?paynum.toFixed(2):0;
	  			}else{
	  				this.selectedPrice =this.lessonData.joinPrice
	  			}
	  		}
  			
  		}catch (e){
  			this.$vux.toast.text(e.message, 'bottom')
  		}
  	}
  	
  	close () {
  	  this.showPost = false
  	  this.trainingCampAlert = false
  	}
  	
  	//调起底部点赞弹窗
  	showEvaluate(item){
  		this.optPunch = item
  		this.isExcellentCard = item.isExcellentCard;
  		this.addActionsConfig.show = true
  	}
  	
  	/**
		 * 点击添加选项item
		 * @param {*} key
		 * @param {*} item
		 */
		async handleAddActoinItem(key, item) {
			let isExcellentCard;
			switch(key) {
				case 'selected':
					isExcellentCard = 1
					break
				case 'disSelect':
					isExcellentCard = 0
					break
				default:
					break
			}
			
			let parama = {
	  		communityId:this.optPunch.communityId,
	  		peopleCourseId:this.optPunch.peopleCourseId,
	  		status:isExcellentCard
	  	}
			
			setExcellentCourseCardApi(parama).then(res=>{
	  		console.log("评选成功")
	  		this.reFresh();
	  		this.$vux.toast.text('评选成功', 'bottom')
	  	}).catch(res=>{
	  		this.$vux.toast.text('评选失败，请重试', 'bottom')
	  	})
		}

	  
	  
	  //刷新打开列表数据
	  reFresh(){
			let parama = {
  			communityId: this.communityId,
  			courseId:this.$route.query.id,
  			type:0,
  			page:0,
  			pageCount:0
  		}
			getCourseCardListApi(parama).then(res=>{
				this.peopleCourseCardList = res.peopleCourseCardList
				this.excellentPunchList = res.excellentPeopleCourseCardList
			})
		}


		hintSucFuc (){
		  let that = this
      let type = this.endPayType
		  that.isEndSock = true

		   if(type == 1){
		      that.freeIn()
		   }else if(type == 2) {
		      that.payOrFree()
		   }else {
		      that.freeJoin()
		   }
       this.cloHint()
		}

		cloHint (){
		  this.isHintShow = false
		}

		openHint (){
		  this.isHintShow = true
		}

	  /*支付。优惠券*/
	  freeIn () { // 跳转到一个图文消息
	    if(this.isEnd ){
	      if(!this.isEndSock){
	        this.endHint(1)
	        return
	      }
	    }

	    if (!this.isFreeBtn) return
	    if (this.lessonData.wechatIntroUrl) {
	      location.href = this.lessonData.wechatIntroUrl
	    } else {
	      this.$vux.toast.text('网络延时，等下再来试试吧~', 'bottom')
	    }
	  }

	  closePya(){
	  	this.toPay = false
	  }

	  // 已结束提示 
	  endHint(type){
      let that = this
	    if(!type){
	      return
	    }
      this.endPayType = type 
  		that.openHint()

	  }
	  payOrFree () {
	    if(this.isEnd ){
	      if(!this.isEndSock){
	        this.endHint(2)
	        return
	      }
	    }
			this.toPay = true;
	  }

	  async freeJoin () {
      let that = this

	    if(this.isEnd ){
	      if(!this.isEndSock){
	        this.endHint(3)
	        return
	      }
	    }

	    await freePay({
	      productId: this.communityId,
        userCouponId:this.usedUserCouponId,
	      productType: 1
	    }).then((res) => {
	      if (that.lessonData.isCourse === 4) { // 训练营
          that.trainingCampAlert = true
          that.init()
        } else {
          that.$vux.alert.show({
            title: '加入成功',
            content: '快去灯塔里和大家一起进步吧',
            buttonText: '好的',
            onHide () {
              that.init()
            }
          })
        }
	    }).catch((e) => {
	      that.$vux.toast.text(e.message, 'bottom')
	    })
	  }

	  async payIn () {
	    const params = await payApi({
	      productId: this.lessonData.communityId,
        userCouponId: this.usedUserCouponId,
	      productType: 1
	    })

	    const arr = Object.keys(params || {})
	    if (arr.length !== 0) {
	      if (typeof WeixinJSBridge === 'undefined') {
	        if (document.addEventListener) {
	          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(params), false)
	        } else if (document.attachEvent) {
	          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(params))
	          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(params))
	        }
	      } else {
	        this.onBridgeReady(params)
	      }
	      /* 训练营调起客服弹窗 */
	      if (this.lessonData.isCourse === 4) {
	        this.trainingCampAlert = true
	      }
	      this.init()
	    }
	  }

	  // 付费成功后
	  pageInit(){
	  	this.$router.go(0)
	  }

	  isPay(){
      if(this.selectCouponItem.userCouponId && this.selectCouponItem.userCouponId!==0){
        //选择其他优惠券
        if(this.selectedPrice>0){
          console.log("我是付费")
          this.usedUserCouponId = this.selectCouponItem.userCouponId;
          this.payIn()
        }else{
          console.log("我是免费免费")
          //选择的优惠券金额够大，可以免费加入
          this.usedUserCouponId = this.selectCouponItem.userCouponId;
          this.freeJoin()
        }
        
      }else if(this.selectCouponItem.userCouponId===0 || this.lessonData.selectCoupon===null){
        //选择不使用优惠券 和 无可用优惠券
        console.log("我是没有优惠券和不用优惠券")
        this.usedUserCouponId = 0;
        this.payIn()
      }else{
        //默认优惠券
        if(this.lessonData.selectCoupon.couponPrice>0){
          console.log("我是默认优惠券，且优惠券价格比塔价格低，需支付")
          //有默认优惠券
          this.usedUserCouponId = this.lessonData.selectCoupon.userCoupon.userCouponId;
          this.payIn()
        }else{
          console.log("我是默认优惠券，且优惠券价格比塔价格高，不用支付")
          this.usedUserCouponId = this.lessonData.selectCoupon.userCoupon.userCouponId;
          this.freeJoin()
        }
      }
      this.toPay = false;
      sessionStorage.removeItem("coupon");
	  }

	  toCoupon(){
	    if(this.selectCouponItem.userCouponId){
	      this.$router.push({path:'/center/coupon',query:{userCouponId:this.selectCouponItem.userCouponId,communityId:this.lessonData.communityId}});
	    }else if(this.selectCouponItem.userCouponId===0 || this.lessonData.selectCoupon===null){
	      this.$router.push({path:'/center/coupon',query:{userCouponId:0,communityId:this.lessonData.communityId}});
	    }else{
	      this.$router.push({path:'/center/coupon',query:{userCouponId:this.lessonData.selectCoupon.userCoupon.userCouponId,communityId:this.lessonData.communityId}});
	    }
	  }

	  /*支付。优惠券*/

    onBridgeReady (params) {
      let self = this
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
          appId: params.appId,
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.package,
          signType: params.signType,
          paySign: params.paySign
        },
        function (res) {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            self.$vux.toast.text('已购买成功', 'bottom')
            const { communityId } = self.$route.params
            let number = Math.random() * 10 + 1
            //
            switch (communityId) {
              case 'ca7cfa129f1d7ce4a04aebeb51e2a1aa':
                self.$store.dispatch('show_qr', {type: 1})
                break
              case '25c2ff088da3f757b685a318ab050b5a': // 测试
                self.$store.dispatch('show_qr', {type: 1})
                break
              case '64074da38681f864082708b9be959e08':
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '67917ba04abd74c3247245576b1168b0': // 测试
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '16a2f4a61d870978f1598b466a48f12e': // 测试 詹润杰的灯塔
                self.$store.dispatch('show_qr', {type: 3})
                break
              case 'a7f79b000c990dd2658b6af10a37fe3c': // 正式 詹润杰的灯塔
                self.$store.dispatch('show_qr', {type: 3})
                break
              case '70036858d957ad830e89e37c5a8356d2': // 测试分销5月9号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '6b3974ad38fa6984de73f43a7730e294': // 正式分销5月9号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case 'b2b533754554bec1b9c344a97063891b': // 测试分销5月16号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '2cdf75243f96bca97ae4341b6400e375': // 正式分销5月16号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '67917ba04abd74c3247245576b1168b0': // 分销5月22号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case 'd71fddeba62a878aecd901198a959674': // 正式分销5月17号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case 'cfaf4bc3648d04a809419d52a78d8d20': // 秋叶塔
                self.$store.dispatch('show_qr', {type: 4})
                break
              case 'db73998f8d1691d3ce75180266e3cba9': // 测试专用
                self.$store.dispatch('show_qr', {type: 4})
                break
              default:
                location.reload()
                break
            }
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            self.$vux.toast.text('已取消支付', 'bottom')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            self.$vux.toast.text('支付失败，请重新购买', 'bottom')
          }
        }
      )
    }

    // 生成海报图
    toPoster () {
      this.showPost = true
//  	this.$router.push({path:`/poster?name=${this.curPeopleInfo.userInfo.realname}&title=${this.communityCourse.title}`})
    }
  	
  	//去打卡编辑页
  	toPunch(){
			this.$router.push({path:`/PunchEditing?courseId=${this.communityCourse.id}&communityId=${this.communityCourse.community[0].idKey}&firstPunch=true`})
  	}
  	
  	//去个人打卡详情页
  	toMindDetail(peopleId,courseId){
  		this.$router.push({path:'/PunchDetails',query:{courseId:this.communityCourse.id,peopleId:this.curPeopleInfo.id}});
  	}
  	
  	//去打卡内容列表页
  	toPunchList(txt){
  		this.$router.push(`/PunchList?toList=${txt}&communityId=${this.communityCourse.community[0].idKey}&courseId=${this.communityCourse.id}`);
  		return;
  	}
  	//预览富文本图片
    readPic(e){
    	if(e.target.tagName==='IMG'){
    		let urls = [];
    		urls.push(e.target.src)
    		let img=String(e.target.src);
    		let parma={
    			urls,
    			img
    		}
    		this.wechatPreviewImage(parma).then().catch(e=>{console.log(e)})
    	}
    }
    //预览普通图片
	  previewImage (img) {
	    const files = this.communityCourse.punchCardImgInfo
	    let urls = []
	    files.forEach((item) => {
	      urls.push(item.pictureUrl)
	    })
	    let parma={
	    	eventType: 'previewImage',
				urls,
				img
			}
  		this.wechatPreviewImage(parma).then().catch(e=>{console.log(e)})
	  }
  	//播放视频
  	playVideo(e){
  		this.video = this.$refs["video"]
			this.video.currentTime = 0
	    this.video.src = this.communityCourse.av.files[0].fileUrl
	    this.videoPlay = false
	    this.video.play()
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
          this.reFresh()
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
    
    beforeRouteEnter(to,from,next){
      if (from.query.firstPunch) {
        next(vm => {
          vm.showPost = true
        })
      } else {
        next()
      }
    }
    
    beforeRouteLeave(to,from,next){
    	next()
    }
    
  }
</script>

<style lang="less" scoped>
  .posterBox{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
    z-index: 9999;
  }
  
  /* 训练营弹窗 */
  .trainingCampAlert{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100vh;
    background:rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    .content, .textContent{
      border-radius: 4px;
      position: relative;
      width: 280px;
      height: 334px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      >.closeBtn{
        position: absolute;
        margin-top: 0;
        top: 15px;
        right: 15px;
        width: 15px;
        height: 15px;
      }
      h3{
        font-size: 18px;
        font-weight: 500;
        color: #354048;
      }
      p{
        margin-top: 12px;
        font-size: 15px;
        font-weight: 300;
        color: #666666;
      }
      img{
        margin-top: 13px;
        width: 122px;
        height: 122px;
      }
      span{
        font-size: 13;
        font-weight: 400;
        color: #BCBCBC;
        margin-top: 2px;
      }
      .copy{
        font-size: 17px;
        color: #D7AB70;
        font-weight: 400;
        margin-top: 30px;
      }
    }
    .textContent{
      height: 160px;
      #copy{
        color: #666666;
        margin-top: 12px;
        font-size: 15px;
      }
    }
  }
  
  /*支付弹窗*/
  .pay_window{
   	position: absolute;
   	top: 0;
   	left: 0;
   	z-index: 9999;
   	width: 100%;
   	height: 100%;
   	background-color: rgba(0,0,0,0.6);
   	.pay_box{
   		animation: 0.4s ease-in-out window-fade-in;
   		box-sizing: border-box;
   		width: 375px;
   		height: 287px;
   		background:rgba(255,255,255,1);
			border-radius:10px 10px 0px 0px;
			position: absolute;
			bottom: 0;
			left: 0;
			padding: 40px 25px 0;
			/*支付灯塔名字*/
			h3{
				font-size:18px;
				color:rgba(53,64,72,1);
				line-height:22px;
				margin-bottom: 10px;
			}
			/*支付副标题*/
			.tip{
				font-size:13px;
				color:rgba(146,146,146,1);
				line-height:17px;
				margin-bottom: 36px;
			}
			/*支付原价格*/
			.price{
				display: flex;
				justify-content: space-between;
				margin-bottom: 31px;
				span{
					font-size:15px;
					color:rgba(102,102,102,1);
					line-height:21px;
				}
			}
			/*支付优惠券处*/
			.coupon_price{
				display: flex;
				justify-content: space-between;
				>span{
					font-size:15px;
					color:rgba(102,102,102,1);
					line-height:21px;
				}
				.coupon_price_right{
					display: flex;
					align-items: center;
					>span{
						display: inline-block;
						font-size:15px;
						color:rgba(250,106,48,1);
						line-height:21px;
					}
					>.more_coupon{
						display: inline-block;
						width: 15px;
						height: 15px;
						background: url(../../assets/icon/btn_enter@2x.png) no-repeat 100%;
					}
				}
				/*margin-bottom:39px;*/
			}
			/*支付最底支付按钮*/
			.payment{
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				border-top:0.5px solid rgba(220,220,220,1);
				height:49px;
				.payment_num{
					margin-right: 20px;
					font-size:13px;
					color:rgba(53,64,72,1);
					span{
						color:rgba(250,106,48,1);
						&:nth-child(1){
							font-size: 13px;
						}
						&:nth-child(2){
							padding-left: 4px;
							font-size: 18px;
						}
					}
				}
				/*支付按钮*/
				.payment_btn{
					display: flex;
					justify-content: center;
					align-items: center;
					width:150px;
					height:49px;
					background:rgba(255,226,102,1);
					font-size:16px;
					color:rgba(53,64,72,1);	
				}
			}
			
   	}
  }
  .footer {
      /*flex: 0 0 auto;*/
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 49px;
      /*position: relative;*/
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #bcbcbc;
      z-index: 9998;
      font-size: 15px;

      & p {
        flex-grow: 1;
        text-align: center;
      }

      & .btn-box {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        height: 100%;
      }

      & .to-home {
        flex: 0 0 auto;
        width: 52px;
        height: 100%;
        border-top: solid 1px #dcdcdc;  /* no */
        border-right: solid 1px #ededed;  /* no */
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: #929292;
        background-color: #ffffff;
        & > span {
          font-size: 11px !important;
        }
      }

      & .time-clock {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #ffffff;
        box-shadow: 0 -1px 0 0 #dcdcdc;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666666;
        & p:last-of-type {
          margin-left: 15px;
          color: #d7ab70;
        }
      }

      & div {
        flex-grow: 1;
        height: 100%;
        font-size: 13px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        border-style: none;
        border-radius: 0;
        border-top: solid 1px #dcdcdc;  /* no */
        &:after {
          border-style: none;
        }

        & span {
        	/*color: #354048;*/
          display: block;
          margin-top: 1px;
        }
        & span:first-of-type {
          margin-top: 0;
          font-size: 16px;
					line-height:20px;
        }

        &.free-btn {
          color: #d7ab70;
          background-color: #ffffff;
					/*bing-增加*/
					flex-grow:1;
          padding: 0 20px;
					& span:nth-of-type(2){
						font-size:12px;
						line-height:16px;
					}
          & span:nth-of-type(1){
          }
					/*bing-增加*/
        }
        &.pay-btn {
					width:225px;
          color: #354048;
          background-color: #ffe266;
          & span:not(:first-of-type) {
            color: rgba(53, 64, 72, 0.8);
          }
          span:nth-child(2){
          	.coupon_price{
            	display: inline-block;
            	font-size:12px;
            	line-height:16px;
            	color:#FB7A37;
            }
          }
					flex-grow:1;
					& .userCoupon{
						font-size: 12px; 
					}
        }
        &.free-btn-disable {
          padding: 0 20px;
        }
        &.free-btn-disable, &.pay-btn-disable {
          color: #bcbcbc;
          & span:nth-of-type(2){
            font-size:12px;
            line-height:16px;
          }
        }
      }
  }
	.Lesson{
		padding-bottom: 49px;
		/*课节头部*/
		.Lesson-header{
			
			.header-photo{
				width: 100%;
				height: 175px;
			}
			.header-title{
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				margin-top: 25px;
				font-size: 21px;
				font-weight: 700;
				color: #354048;
				
			}
		}
		/*课节富文本*/
		.Lesson-module{
			margin-top: 15px;
			.module-header{
				padding: 0 20px;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				.head-photobox{
					display: flex;
					align-items: center;
					img{
						border-radius: 50%;
						width: 24px;
						height: 24px;
					}
					.name{
						margin-left: 8px;
						font-size: 14px;
						color: #666666;
					}
				}
				.date{
					font-weight: 300;
					color: #666666;
					font-size: 14px;
				}
			}
			/*课节视频*/
			.Lesson-video{
				margin-top: 28px;
				padding: 0 20px;
				height: 187px;
				position: relative;

      & .placeholder {
      		position: absolute;
      		top: 0;
      		left: 20px;
	        width: 335px;
	        height: 187px;
	        background: rgba(0, 0, 0, .8) url('./../../assets/icon/video-play.png') no-repeat center;
	        background-size: 35px 35px;
	
	        & img {
	          width: 100%;
	          height: 100%;
	        }
	      }
	
	      & video {
	        width: 100%;
	        height: 187px;
	      }
			}
			/*音频内容*/
			.content-audio{
				margin-top: 28px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			/*课节富文本*/
			.module-content{
				box-sizing: border-box;
				padding: 0 20px;
				margin-top: 30px;
				width: 100%;
				min-height: 400px;
				>section{
					font-size: 16px !important;
				}
			}
		}
		/*本节打卡任务*/
		.Lesson-task{
			padding: 0 20px;
			.content-txt{
				width: 100%;
			}
			.content-img{
				& .content-images {
		      margin-top: 10px;
		      width: 335px;
					// margin-left:7%;
		      display: flex;
					// justify-content:space-between;
		      flex-flow: row wrap;
		
		      & > .item-image {
		        margin-top: 5px;
		        margin-left: 5px;
		        width: 108px;
		        height: 108px;
		        text-align: center;
						flex-grow:0;
						
		
		        &:first-of-type, &:nth-of-type(3n + 1) {
		          margin-left: 0;
		        }
		
		        & img {
		          background: #f9f9f9;
		          width: 100%;
		          height: 100%;
		          vertical-align: middle;
		        }
		      }
		      & > .item-image.one {
		        width: 136px;
		        height: 136px;
		      }
		    }
			}
		}
		/*优秀打卡和全部打卡的样式区*/
		.Lesson-punch{
			.headerBox{
				margin-left: 20px;
			}
		}
		.Lesson-punch,
		.all-punch{
			/*优秀打卡标签*/
			.Excellent-punch{
				padding: 0 20px;
				box-sizing: border-box;
				width: 100%;
				.Excellent-punch-title{
					color:#929292;
					font-size: 18px;
					font-weight: 700;
					padding-left: 15px;
					height: 22px;
					width: 100%;
					position:relative; 
					margin-bottom: 10px;
					&::before{
						content: '';
						position: absolute;
						top: 2.5px;
						left: 0;
						width: 5px;
						height: 17px;
						background-color: #FFE266;
					}
				}
			}
			/*优秀打卡与所有打卡的间距*/
			.excellentPunchList{
				margin-bottom: 50px;
				>.dynamic-item{
					box-sizing: border-box;
					padding: 0 20px;
					&:last-child{
						border-bottom: none;
					}
				}
			}
			/*底部展开按钮*/
			.Expand-btn{
				position: relative;
				padding: 0 20px;
				box-sizing: border-box;
				&::before{
					content: "";
					position: absolute;
					top: -1px;
					left: 0;
					background: #FFFFFF;
					height: 2px;
					width: 100%;
					z-index: 8888;
				}
				>div{
					width: 100%;
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					color: #354048;
					background-color: rgba(255, 226, 102, 0.16);
					border-radius: 20px;
					&>span{
						padding-left: 7px;
					}
				}
			}
			>.dynamic-item{
				box-sizing: border-box;
				padding: 0 20px;
			}
		}
		.hr{
			/*margin-left: -20px;*/
			width: 375px;
			height: 0.5px;
			background: #EDEDED;
		}
		
		/*所有打卡*/
		.all-punch{
			.all-show{
				margin-bottom: 50px;
			}
			>.dynamic-item{
				&:last-child{
					border-bottom: none;
				}
			}
		}
		/*课节底部按钮区*/
		.Lesson-footer{
			background-color: #FFFFFF;
			width: 100%;
			height: 49px;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 100;
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			border-top: 0.5px solid #DCDCDC;
			
			.toPunch{
				width: 100%;
				height: 100%;
				background-color: #FFE266;
				line-height: 49px;
				text-align: center;
				color: #354048;
			}
			.peacock,.mine{
				height: 100%;
				width: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #354048;
			}
			.line{
				width: 2px;
				height: 28px;
				background-color: #EDEDED;
				
			}
		}
		/*公共部分*/
		.Lesson-punch,.Lesson-task{
			margin-top: 60px;
			box-sizing: border-box;
		}
		/*头部标题样式*/
		.headerBox{
			width: 100%;
			height: 54px;
			/*background-color: #C9C9C9;*/
			margin-bottom: 30px;
			position: relative;
			.title-pic1{
				width: 330px;
				height: 46px;
				border: 1.5px solid #354048;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1;
				text-align: center;
				background-color: #FFFFFF;
				.txt{
					display: inline-block;
					text-align: center;
					line-height: 46px;
					font-size: 18px;
					font-weight: 700;
					color: #354048;
					padding: 0 19px;
					position: relative;
					&::before{
						content: '';
						position: absolute;
						top: 24px;
						left: -27.5px;
						width: 27.5px;
						height: 1.5px;
						background-color: #929292;
					}
					&::after{
						content: '';
						position: absolute;
						top: 24px;
						right: -27.5px;
						width: 27.5px;
						height: 1.5px;
						background-color: #929292;
					}
				}
			}
			.title-pic2{
				width: 330px;
				height: 46px;
				border: 1.5px solid #354048;
				background-color: #FFE266;
				position: absolute;
				left: 5px;
				top: 5px;
				z-index: 0;
			}
		}
		@keyframes window-fade-in{
  	from{
  		opacity: 0;
  		transform: translateY(100%);
  	}
  	to{
  		opacity: 1;
  		transform: translateY(0);
  	}
  }
	}
</style>