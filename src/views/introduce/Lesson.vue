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
      		<img :src="communityCourse.people.headimgurl"/>
      		<span class="name">{{communityCourse.people.realname}}</span>
      	</div>
      	<div class="date">{{communityCourse.createTime*1000 | date('YYYY-MM-DD')}}</div>
      </div>
      <!--视频-->
      <div class="Lesson-video" @click.stop="playVideo($event)" v-if="communityCourse.av && communityCourse.av.type==='video'">
      	<video controls ref="video"></video>
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
        ></audioBox>
      </div>
      <div class="module-content h5-code" @click.stop="readPic($event)" v-html="communityCourse.details">
      </div>
    </div>

    <!-- 已加入 -->
		<template v-if="lessonData && isJoinAgency">
		    <!--本节任务-->
				<div class="Lesson-task" v-if="trialReading === '0'">
					<!--头部标题-->
					<div class="headerBox">
						<div class="title-pic1">
							<span class="txt">本节打卡任务</span>
						</div>
						<div class="title-pic2"></div>
					</div>
					<!--头部标题-->
					<div class="content-txt" v-html="communityCourse.punchCardTitle">
					</div>
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
			      ></lessondynamicItem>
			      <div class="Expand-btn" @click.stop="toPunchList('excellent')" v-if="countCardInfo.totalExcellentCardCount>5">查看所有优秀打卡 <span>({{countCardInfo.totalExcellentCardCount}})</span></div>
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
		      ></lessondynamicItem>
		      <div class="Expand-btn all-show" @click.stop="toPunchList('all')" v-if="countCardInfo.totalCardCount>5">查看所有打卡 <span>({{countCardInfo.totalCardCount}})</span></div>
				</div>
				
				<!--底部打卡按钮区-->
				<div v-if="trialReading === '0' || (curPeopleInfo.roleId!=1 && curPeopleInfo.roleId!=2)">
					<div class="Lesson-footer" v-if="isPunch === 0">
						<div class="toPunch" @click.stop="toPunch">
							去打卡
						</div>
					</div>
					<div class="Lesson-footer" v-else>
							<div class="peacock" @click.stop="toPoster()">炫耀一下</div><span class="line"></span>
							<div class="mine" @click.stop="toMindDetail(communityCourse.peopleId,communityCourse.id)">我的打卡</div>
					</div>
				</div>
		</template>
    <!-- 未加入 -->
		<template v-else>
			<div class="footer">
			  <p v-if="lessonData.communityStatus === 2">课程已下线，暂时不可加入</p>
			  <p v-else-if="lessonData.remainingJoinNum <= 0">课程已满员，暂时不可加入</p>
			  <div class="btn-box" v-else>
			    <div :class="{'free-btn': isFreeBtn, 'free-btn-disable': !isFreeBtn}"
			            :disabled="!isFreeBtn" v-if="lessonData.freeJoinNum > 0" @click="freeIn">
			      <span>集Call免费加入</span>
			      <span>({{freeSurplusPeople > 0 ? '剩余：' + freeSurplusPeople : '已满员'}})</span>
			    </div>
			    <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
			            :disabled="!isPayBtn" @click="payOrFree" v-if="lessonData.payJoinNum > 0 && lessonData.joinPrice > 0">
			      <span>付费加入:¥{{lessonData.joinPrice}}</span>
			    </div>
			    <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
			            :disabled="!isPayBtn" @click="freeJoin" v-if="lessonData.payJoinNum > 0 && lessonData.joinPrice === 0">
			      <span>免费加入</span>
			    </div>
			  </div>
			</div>
		</template>
	</div>
</template>

<script>
	import Vue from 'vue'
  import Component from 'vue-class-component'
	import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
  import audioBox from '@/components/media/music'
  import WechatMixin from '@/mixins/wechat'
  import { lessonContentApi, getCourseCardListApi } from '@/api/pages/pageInfo'
  import {payApi, freePay} from '@/api/pages/pay'
  @Component({
    name: 'Lesson',
    components: {
      lessondynamicItem,
      audioBox
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
    //富文本虚拟数据
    intro = '<p>社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍</p><p><img src="https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/Uploads/static/picture/2018-08-08/2d6e172b6cbecf6c9de11727d89d8d0f.png" alt="商业课-推广海报" style="max-width:100%;"><br></p><p><br></p>'

    //音频数据
    item = {
    	files:[{
				duration:250,
				fileId:"6237",
				fileUrl:"https://cdnstatic.ziwork.com/test/audio/2018-08-15/4bd491cb8292450b62b387a595f15ee8.mp3",
				avatar:"2JVOTrwtULW3VpcKI3whmcDNYTlTMEVQzPpxN3ZDfXOcFYKtUiv7XZwjXolTara2.amr"
	    }],
    }
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


  	//试读。未加入相关
  	lessonData = {}
  	
  	events = {
  		
  	}

  	created(){
  		this.trialReading = this.$route.query.isTry
  		console.log(this.trialReading,"是否试读。。。。。")
  		let parama = {
  			communityId:this.$route.query.communityId,
  			courseId:this.$route.query.id,
  			type:0,
  			page:0,
  			pageCount:0
  		}

  		Promise.all([lessonContentApi(this.$route.query.id),getCourseCardListApi(parama)]).then((res)=>{
				//console.log(res,"请求回来的数据")
				this.lessonData = res[0].couponInfo
  			this.communityId = res[0].communityId
  			this.communityCourse = res[0].communityCourse
  			this.countCardInfo = res[0].countCardInfo
  			if(this.communityCourse.av.files[0]){
  				this.communityCourse.av.files[0].fileId = String(this.communityCourse.av.files[0].fileId)
  			}
  			this.curPeopleInfo = res[0].curPeopleInfo
  			this.peopleCourseCardList = res[1].peopleCourseCardList.length>0?res[1].peopleCourseCardList:""
  			this.excellentPunchList = res[1].excellentPeopleCourseCardList.length>0?res[1].excellentPeopleCourseCardList:""
  			this.isPunch = res[0].peopleCardInfo.isPunchCard
  		}).catch((e)=>{
  			console.log(e,"返回报错")
  		})
  	}
  	
  	mounted () {
  		this.$nextTick(()=>{
  		})
	  }

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

	  // 已结束提示 
	  endHint(type){
      let that = this
	    if(!type){
	      return
	    }
	    
	    this.$vux.confirm.show({
	      title: '加入须知',
	       content: `该课程已经全部更新完毕了！ \n 加入后你获得以下内容： \n 1、塔主课程以及小伙伴们沉淀 下来的宝贵内容；\n  2、和成员们一起交流学习； \n 3、提问导师或嘉宾，但不一定 能100%得到回答`,
	       confirmText: '马上加入',
	       cancelText: '我再想想',
	       onConfirm: function (res) {
	        that.isEndSock = true
	         if(type == 1){
	            that.freeIn()
	         }else if(type == 2) {
	            that.payOrFree()
	         }else {
	            that.freeJoin()
	         }
	       },
	     })
	  }
	  
	  //刷新打开列表数据
	  reFresh(){
			let parama = {
  			communityId:this.$route.query.communityId,
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

	  payOrFree () {
	    if(this.isEnd ){
	      if(!this.isEndSock){
	        this.endHint(2)
	        return
	      }
	    }
	    let that = this
	    that.payIn()
	  }

	  async freeJoin () {

	    if(this.isEnd ){
	      if(!this.isEndSock){
	        this.endHint(3)
	        return
	      }
	    }

	    await freePay({
	      productId: this.communityId,
	      productType: 1
	    }).then((res) => {
	      const that = this
	      this.$vux.alert.show({
	        title: '加入成功',
	        content: '快去灯塔里和大家一起进步吧',
	        buttonText: '好的',
	        onHide () {
	      		this.pageInit()
	        }
	      })
	    }).catch((e) => {
	      this.$vux.toast.text(e.message, 'bottom')
	    })
	  }

	  async payIn () {
	    const params = await payApi({
	      productId: this.lessonData.communityId,
	      productType: 1
	    })

	    console.log(params)
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
	      this.pageInit()
	    }
	  }

	  // 付费成功后
	  pageInit(){
	  	console.log(1111,this.isJoinAgency)
	  	if (this.isJoinAgency) {
	  	  if(this.lessonData.isCourse === 3){
	  	    this.$router.replace(`/introduce2/${this.communityId}/community`)
	  	  }else {
	  	    this.$router.replace(`/introduce/${this.communityId}/community`)
	  	  }
	  	  return
	  	}
	  }

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
            console.log('communityId', communityId)
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
    	this.$router.push({path:`/poster?name=${this.curPeopleInfo.userInfo.realname}&title=${this.communityCourse.title}`})
    }
  	
  	//去打卡编辑页
  	toPunch(){
			this.$router.push({path:`/PunchEditing?courseId=${this.communityCourse.id}&communityId=${this.communityCourse.community[0].idKey}`})
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
    		console.log(img,"我是图片路径信息")
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
			console.log(img,"我是图片路径信息")
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

  	

  }
</script>

<style lang="less" scoped>
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
    z-index: 999;
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
				//width:150px;
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
				flex-grow:1;
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
				
			}
			/*课节视频*/
			.Lesson-video{
				margin-top: 28px;
				padding: 0 20px;
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
				.audio-wrapper{
					width: 335px;
					height: 60px;
					border-radius: 30px !important;
					background-color: RGBA(255, 226, 102, 0.38);
				}
			}
			/*课节富文本*/
			.module-content{
				box-sizing: border-box;
				padding: 0 20px;
				margin-top: 30px;
				width: 100%;
			}
		}
		/*本节打卡任务*/
		.Lesson-task{
			
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
		/*优秀打卡区*/
		.Lesson-punch,.all-punch{
			
			/*优秀打卡标签*/
			.Excellent-punch{
				width: 100%;
				.Excellent-punch-title{
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
			/*优秀打卡最后一个样式*/
			.excellentPunchList{
				>.dynamic-item{
					&:last-child{
						border-bottom: none;
					}
				}
			}
			/*底部展开按钮*/
			.Expand-btn{
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
			>.dynamic-item{
				&:last-child{
					border-bottom: none;
					/*margin-top: 50px;*/
				}
			}
		}
		.hr{
			margin-left: -20px;
			width: 375px;
			height: 0.5px;
			background: #EDEDED;
		}
		
		/*所有打卡*/
		.all-punch{
			padding: 0 20px;
			margin-top: 50px;
			.all-show{
				margin-bottom: 50px;
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
			z-index: 9998;
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
			padding: 0 20px;
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
		
	}
</style>