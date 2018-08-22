<template>

  <!-- 大咖介绍页 -->
  <div ref="body" class="big-shot-introduce">

    <div class="container" ref="big-shot-introduce-container" :class="{ 'no-pdb': !completelyShow }">
      <div class="header">

        <community-card ref="headCard" :community="pageInfo" :type="2" :isCommunityIntroduce="completelyShow"/>
        <div class="share-group fixed">
          <div class="group_wrap">
            <button type="button" class="home u-btn" @click="toHome"><i class="u-icon-community-home"></i></button>
            <button type="button" class="invite u-btn" v-if="!pageInfo.isAudit && pageInfo.isSell === 2" @click="showSell = true">邀请函</button> 
            <button type="button" class="money u-btn" v-else-if="!pageInfo.isAudit && pageInfo.isSell === 1"  @click="showSell = true">
              ¥{{pageInfo.sellPrice}}
            </button>
            <button type="button" class="share u-btn" v-else @click="showShare = true"><i class="u-icon-share-community"></i></button>
          </div>
          <span class="money_other" v-if="!pageInfo.isAudit && pageInfo.isSell === 1">
            分享赚
            <img src="../../assets/icon/bg_share.png" />
          </span>
        </div>

        <!--<div class="share-btn-3" v-if="!pageInfo.isAudit && pageInfo.isSell === 2" @click="showSell = true">-->
        <!--</div>-->
        <!--<div class="share-btn-2" v-else-if="!pageInfo.isAudit && pageInfo.isSell === 1" @click="showSell = true">-->
          <!--<span>分享赚¥{{pageInfo.sellPrice}}</span>-->
        <!--</div>-->
        <!--<div class="share-btn" v-else @click="showShare = true">-->
          <!--<img class="share-icon" src="./../../assets/icon/icon_share.png" />-->
          <!--<span>分享</span>-->
        <!--</div>-->
      </div>

      <div class="module"  style="min-height: 70vh" >
        <div class="module-title">
        	<!--<div class="hr"></div>-->
          <p>关于灯塔</p>
          
          <!--关于塔主标签-->
          <!--<span class="module-title-tip-line"></span>
          <div class="module-title-tip">关于塔主</div>-->
        </div>
        <div ref="h5Code" v-if="pageInfo.intro" class="module-content h5-code" v-html="pageInfo.intro" @click.stop="readPic($event)">
        </div>
      </div>
      <div class="how-to-play">
        <a href="https://stg.ziwork.com/zikeappstatic/lighthousestatic/howplay/index.html">
          <img src="./../../assets/how2play.png" />
        </a>
      </div>
      <div class="module" v-if="completelyShow && dynamicList.length > 0">
        <div class="module-title">
          <p>精选内容</p>
          <div class="hr"></div>
        </div>
        <div class="module-content">
          <dynamic :dynamicList="dynamicList"
                   :hideCommentArea="false"
                   :showDelBtn="true"
                   :showIdentification="false"
                   :showLightHouseInfo="false"
                   :disableOperationArr="disableOperationArr"
                   @disableOperationEvents="disableOperationEvents"
                   :disableUserClick="true"
                   :isTeacher="false"
                   :communityId="pageInfo.communityId"
          ></dynamic>
        </div>
        <div class="desc">
          加入灯塔，即可解锁更多内容~
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="module relevant" v-if="relevantList.length > 0">
        <div class="module-title">
          <p>相关灯塔</p>
          <div class="hr"></div>
        </div>
        <div class="module-content">
          <community-info-card class="community-item" v-for="item in relevantList" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
        </div>
      </div>
    </div>

		<!--第一级支付按钮-->
    <div class="footer" v-show="completelyShow">
      <div class="time-clock" v-if="isJoinAgency">
        <p>开课倒计时</p>
        <p>{{pageInfo.duration}}</p>
      </div>
      <p v-else-if="pageInfo.communityStatus === 2">灯塔已下线，停止报名</p>
      <p v-else-if="pageInfo.remainingJoinNum <= 0">已满员，停止报名</p>
      <div class="btn-box" v-else>
        <div :class="{'free-btn': isFreeBtn, 'free-btn-disable': !isFreeBtn}"
                :disabled="!isFreeBtn" v-if="pageInfo.freeJoinNum > 0" @click="freeIn">
          <span>集Call免费加入</span>
          <span>({{freeSurplusPeople > 0 ? '剩余：' + freeSurplusPeople : '已满员，通道关闭'}})</span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="payOrFree" v-if="pageInfo.payJoinNum > 0 && pageInfo.joinPrice > 0">
          <span>付费加入:¥{{pageInfo.joinPrice}}/{{pageInfo.cycle}}</span>
          <span v-if="pageInfo.selectCoupon">用券省 
          	<span class="coupon_price" v-if="pageInfo.selectCoupon.userCoupon.coupon.discount<pageInfo.joinPrice">{{pageInfo.selectCoupon.userCoupon.coupon.discount}}</span> 
          	<span class="coupon_price" v-else>{{pageInfo.joinPrice}}</span> 元
          </span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="freeJoin" v-if="pageInfo.payJoinNum > 0 && pageInfo.joinPrice === 0">
          <span>免费加入</span>
        </div>
      </div>
    </div>
    
    <!--支付弹窗-->
    <div class="pay_window" v-if="toPay" @click="closePya">
    	<div class="pay_box" @click.stop="showPayWindow">
    		<h3>{{pageInfo.title}}</h3>
    		<div class="tip">成功付款后，就可以开始你的职场提升之路了~</div>
    		<div class="price">
    			<span>社区价格</span>
    			<span>¥ {{pageInfo.joinPrice}}</span>
    		</div>
    		<div class="coupon_price" @click.stop="toCoupon">
    			<span>优惠券</span>
    			<div class="coupon_price_right">
    				<span v-if="selectCouponItem.userCouponId && selectCouponItem.userCouponId!==0">-¥ {{selectCouponItem.coupon.discount>pageInfo.joinPrice?pageInfo.joinPrice:selectCouponItem.coupon.discount}}</span>
    				<span v-else-if=" pageInfo.selectCoupon!==null && selectCouponItem.userCouponId===0 ">不使用优惠券</span>
    				<span v-else-if=" pageInfo.selectCoupon===null ">无可用优惠券</span>
    				<span v-else>-¥ {{pageInfo.selectCoupon.userCoupon.coupon.discount>pageInfo.joinPrice?pageInfo.joinPrice:pageInfo.selectCoupon.userCoupon.coupon.discount}} </span>
    				<div class="more_coupon"></div>
    			</div>
    		</div>
    		<div class="payment">
    			<div class="payment_num">
    				实付：<span>¥</span>
    				<!--选择其他优惠券-->
    				<span v-if="selectCouponItem.userCouponId && selectCouponItem.userCouponId!==0">{{selectedPrice}}</span>
    				<!--不使用优惠券和无优惠券-->
    				<span v-else-if=" pageInfo.selectCoupon===null || selectCouponItem.userCouponId===0 ">{{pageInfo.joinPrice}}</span>
    				<!--使用默认优惠券-->
    				<span v-else>{{pageInfo.selectCoupon.couponPrice}}</span>
    			</div>
    			<div class="payment_btn" @click.stop="isPay">立即支付</div>
    		</div>
    	</div>
    </div>
    
    <!--分享弹窗-->
    <share-dialog :isShow="showShare" @close-share="showShare = false"
                  :shareType="1"></share-dialog>

    <div class="home-mask" v-if="showSell">
      <div class="sell-container">
        <i class="u-icon-close icon-close" @click="showSell = false"></i>
        <div class="Qr">
          <img :src="qrSrc">
        </div>
        <p>长按识别二维码，关注公众号即可获取</p>
        <p>{{pageInfo.isSell && pageInfo.isSell === 2 ? '专属海报，邀请好友一起学习' : '专属海报及查询实时奖励'}}</p>
      </div>
    </div>

    <hint-msg 
      :isHintShow = isHintShow 
      :msg = hintData
      :type = 2
      @cloHint = cloHint
      @hintSucFuc = hintSucFuc
    ></hint-msg>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import CommunityCard from '@/components/communityCard_v2'
  import dynamic from '@/components/dynamic/dynamic'
  import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
  import hintMsg from '@/components/hintMsg/hintMsg'
  import {getCommunityInfoApi, countCodeApi} from '@/api/pages/pageInfo'
  import WechatMixin from '@/mixins/wechat'
  import {payApi, freePay} from '@/api/pages/pay'
  import wxUtil from '@/util/wx/index'
  import ShareDialog from '@/components/shareDialog/ShareDialog'
  Component.registerHooks([
	  'beforeRouteEnter',
	  'beforeRouteLeave',
	  'beforeRouteUpdate' // for vue-router 2.2+
	])

  @Component({
    name: 'big-shot-introduce',
    components: {
      dynamic,
      communityInfoCard,
      CommunityCard,
      hintMsg,
      ShareDialog
    },
    computed: {
      // 剩余免费名额
      freeSurplusPeople () {
        let n = parseInt(this.pageInfo.freeJoinNum) - parseInt(this.pageInfo.freeJoinedNum)
        return n
      },
      // 剩余付费名额
      paySurplusPeople () {
        let n = parseInt(this.pageInfo.payJoinNum) - parseInt(this.pageInfo.payJoinedNum)
        return n
      },
      // 是否已入社
      isJoinAgency () {
        return this.pageInfo.isAuthor || this.pageInfo.isJoined
      },
      // 是否已结束
      isEnd () {
        let {serverTime, endTime} = this.pageInfo
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
      '$route' (route) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.pageYOffset = 0
        if (this.$refs['headCard']) {
          this.$refs['headCard'].stopCountdown()
        }
        this.pageInit().then(() => {
          const {
            title,
            simpleIntro,
            master,
            shareImg, // 分享图片
            sharePoint, // 分享摘要
            shareIntroduction,  // 分享标题
            communityId
          } = this.pageInfo
          console.log("222222222",this.pageInfo)
          // 是否已入社
          if (this.completelyShow && this.isJoinAgency) {
            this.$router.replace(`/introduce/${communityId}/community`)
            return
          }

          const {realName, career} = master
          const str = realName ? realName + (career ? '|' + career : '') : ''
          console.log('location.href', location.href)
          // 页面分享信息
          this.wechatShare({
            'titles': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
            'title': `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
            'desc': sharePoint || simpleIntro,
            'imgUrl': shareImg,
            'link': location.origin + `/beaconweb/#/introduce/${communityId}`
          })
        })
      }
      
    },
    mixins: [WechatMixin]
  })
  export default class introduce extends Vue {
  	toPay = false			//是否调起支付窗口
    showShare = false // 显示分享弹框
    showSell = false // 显示分销弹框
    pageInfo = {}
    dynamicList = []
    relevantList = []
    disableOperationArr = ['comment', 'praise']
    completelyShow = true
    el = ''
    qrSrc = ''
    selectCouponItem = {}		//当前选择的优惠券信息
    selectedPrice = ''		//选择其他优惠券后的价格
    usedUserCouponId = 0		//支付时使用的优惠券id

    isEndSock = false  //已结束的锁  
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

    /*提示----*/
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
    /*提示----*/

    pxToRem (_s) {
      // 匹配:20px或: 20px不区分大小写
      const reg = /(\:|: )+(\d)+(px)/gi
      let newStr = _s.replace(reg, function (_x) {
        _x = _x.replace(/(\:|: )/, '').replace(/px/i, '')
        return ':' + parseFloat(_x) / 32 + 'rem'
      })
      return newStr
    }
    freeIn () { // 跳转到一个图文消息
      if(this.isEnd ){
        if(!this.isEndSock){
          this.endHint(1)
          return
        }
      }

      if (!this.isFreeBtn) return
      if (this.pageInfo.wechatIntroUrl) {
        location.href = this.pageInfo.wechatIntroUrl
      } else {
        this.$vux.toast.text('网络延时，等下再来试试吧~', 'bottom')
      }
    }
    
    closePya(){
    	this.toPay = false
    }
    
    showPayWindow(){}
    
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
     		
     	}else if(this.selectCouponItem.userCouponId===0 || this.pageInfo.selectCoupon===null){
     		//选择不使用优惠券 和 无可用优惠券
     		console.log("我是没有优惠券和不用优惠券")
     		this.usedUserCouponId = 0;
   			this.payIn()
     	}else{
     		//默认优惠券
     		if(this.pageInfo.selectCoupon.couponPrice>0){
     			console.log("我是默认优惠券，且优惠券价格比塔价格低，需支付")
     			//有默认优惠券
     			this.usedUserCouponId = this.pageInfo.selectCoupon.userCoupon.userCouponId;
     			this.payIn()
     		}else{
     			console.log("我是默认优惠券，且优惠券价格比塔价格高，不用支付")
     			this.usedUserCouponId = this.pageInfo.selectCoupon.userCoupon.userCouponId;
     			this.freeJoin()
     		}
     	}
     	this.toPay = false;
     	sessionStorage.removeItem("coupon");
    }
   
    toCoupon(){
     	if(this.selectCouponItem.userCouponId){
     		this.$router.push({path:'/center/coupon',query:{userCouponId:this.selectCouponItem.userCouponId,communityId:this.pageInfo.communityId}});
     	}else if(this.selectCouponItem.userCouponId===0 || this.pageInfo.selectCoupon===null){
     		this.$router.push({path:'/center/coupon',query:{userCouponId:0,communityId:this.pageInfo.communityId}});
     	}else{
     		this.$router.push({path:'/center/coupon',query:{userCouponId:this.pageInfo.selectCoupon.userCoupon.userCouponId,communityId:this.pageInfo.communityId}});
     	}
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
        productId: this.pageInfo.communityId,
        productType: 1,
        userCouponId:this.usedUserCouponId
      }).then((res) => {
      	that.toPay = false;		//关闭支付窗口
      	sessionStorage.removeItem("coupon");		//移除优惠券信息
        that.$vux.alert.show({
          title: '加入成功',
          content: '快去灯塔里和大家一起进步吧',
          buttonText: '好的',
          onHide () {
            that.pageInit()
          }
        })
      }).catch((e) => {
        that.$vux.toast.text(e.message, 'bottom')
      })
    }
    toHome () {
      this.$router.replace(`/index`)
    }

    /**
     * 点击卡片
     */
    handleTapCard (item) {
      let url = ''
      if (item.isAuthor === 1 || item.isJoined === 1) { // 如果已经加入并且已入社跳转到入社后页面
        this.$router.push(`/introduce/${item.communityId}/community`)
      } else { // 未入社跳到未入社页面
        url = `/introduce/${item.communityId}?reload=true`
      	this.completelyShow = true;
        this.$router.push(url)
      }
    }

    async payIn () {
      const params = await payApi({
        productId: this.pageInfo.communityId,
        productType: 1,
        userCouponId: this.usedUserCouponId
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
        this.pageInit()
      }
    }

    onBridgeReady (params) {
      let self = this
      /*eslint-disable*/
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
            switch (communityId) {
              case '0125347d17e7c24d7e969783a26b922d': // 好点子塔
                self.$store.dispatch('show_qr', {type: 3})
                break

              case '270abb50e490783896f2396e58bfbfad': // 活动塔0628
                self.$store.dispatch('show_qr', {type: 1})
                break
              case '953c439c79fdd336bf5864aa2d6356ac': // 活动塔271考拉塔
                self.$store.dispatch('show_qr', {type: 4})
                break
              default:
                self.$store.dispatch('show_qr', {type: 2})
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

    async created () {
    	console.log(location,'我是页面路径')
      wxUtil.reloadPage()
      if (this.$route.name === 'introduce-detail') {
        this.completelyShow = false
      }
      
      const { code = '' } = this.$route.query
      const { communityId } = this.$route.params

      if (code) {
        try {
          if (communityId === 'a7f79b000c990dd2658b6af10a37fe3c') { // 如果为此社区 跳转首页
            this.$router.replace(`/index`)
          }
          await countCodeApi({ code, communityId })
        } catch (e) {
          this.$vux.toast.text(e.message, 'bottom')
        }
      }
      
      const self = this
      await this.pageInit().then(() => {
        const {
          title,
          simpleIntro,
          master,
          shareImg, // 分享图片
          sharePoint, // 分享摘要
          shareIntroduction,  // 分享标题
          communityId
        } = self.pageInfo

        const {realName, career} = master
        console.log('location.href', location.href)
        // 页面分享信息
        self.wechatShare({
          'titles': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'title': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'desc': sharePoint || simpleIntro,
          'imgUrl': shareImg,
          'link': location.origin + `/beaconweb/#/introduce/${communityId}`
        })
      })
      const { autoPay=''} = this.$route.query
      if (autoPay) {
        let that = this
        that.payIn()
      }
    }

    async pageInit () {
      const { communityId } = this.$route.params
      const { saleId: applyId } = this.$route.query
      const res = await getCommunityInfoApi({communityId, data: {applyId}})
      this.qrSrc = res.sellImg
      this.pageInfo = res
      
      //是否调起支付
      let Selectcoupon=sessionStorage.getItem("coupon");
      if(Selectcoupon){
      	this.toPay = true;
      	let CouponItem = sessionStorage.getItem("coupon");
      	this.selectCouponItem = JSON.parse(CouponItem);
      	if(this.selectCouponItem.userCouponId!==0){
      		let paynum=this.pageInfo.joinPrice-this.selectCouponItem.coupon.discount;
      		this.selectedPrice = this.pageInfo.joinPrice>this.selectCouponItem.coupon.discount?paynum.toFixed(2):0;
      	}else{
      		this.selectedPrice =this.pageInfo.joinPrice
      	}
      	
      	console.log(this.selectCouponItem,this.selectedPrice,"我是当前选择的优惠券信息")
      }

      // 是否已入社
      if (this.completelyShow && this.isJoinAgency) {
        if(res.isCourse === 3){
          this.$router.replace(`/introduce2/${communityId}/community`)
        }else {
          this.$router.replace(`/introduce/${communityId}/community`)
        }
        return
      }else {
        console.log('res.isCourse',res.isCourse)
        //优惠卷进入。判断是否旧的
        if(res.isCourse === 3){
          this.$router.replace(`/introduce2/${communityId}`)
          return
        }
      }

      const temp = new Array(...res.circles || [])
      temp.forEach((item) => {
        if (item['modelType'] === 'problem') {
          item['answers'].forEach((answer) => {
            answer.musicState = 0
            answer.progress = 0
          })
        } else if (item['circleType'] === 1) {
          item.musicState = 0
          item.progress = 0
        } else if (item['circleType'] === 2) {
          item.videoPlay = false
        }
      })

      this.dynamicList = temp
      this.relevantList = res.relevantRecommendations || []
      this.pageInfo.intro = this.pxToRem(this.pageInfo.intro)
    }

    disableOperationEvents (e) {
      const {eventType} = e
      console.log(eventType, '拦截')

      const _this = this
      const isBuy = _this.pageInfo.joinPrice > 0
      this.$vux.confirm.show({
        title: '评论点赞',
        content: '您还没有加入，暂时不能操作',
        confirmText: isBuy ? '付费加入' : '免费加入',
        cancelText: '我知道了',
        onCancel () {
        },
        onConfirm () {
          console.log(_this) // 当前 vm
          if (isBuy) {
            _this.payOrFree()
          }
          else {
            _this.freeJoin().then(() => {})
          }
        }
      })
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

    mounted () {
    }
    
    beforeRouteLeave(to,from,next){
    	sessionStorage.removeItem("coupon");
    	next();
    }
  }
</script>
<style lang="less" scoped type="text/less">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .big-shot-introduce {
    /*min-height: 100%;*/
   	height: 100%;
    padding-bottom: 55px;
    box-sizing: border-box;
    overflow-y: auto;
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
    /*overflow: hidden;*/

    &.no-pdb {
    	
      padding-bottom: 0;
    }

    & .header {
      position: relative;
      margin-bottom: 20px;

      & .share-btn, & .share-btn-2, & .share-btn-3 {
        position: absolute;
        top: 15px;
        right: 0;
        width: 70px;
        height: 32px;
        border-radius: 50px 0 0 50px;
        background-color: rgba(255, 255, 255, .8);
        font-size: 15px;
        line-height: 32px;
        color: #d7ab70;
        display: flex;
        align-items: center;
        justify-content: center;

        & .share-icon {
          width: 15px;
          height: 15px;
          margin-right: 5px;
          margin-left: 10px;
        }

        &::after {
          content: none;
        }
      }

      & .share-btn-2 {
        position: fixed;
        padding-left: 10px;
        min-width: 85px;
        background-color: #ffe266;
        font-size: 13px;
        color: #354048;
        z-index: 99;
      }

      & .share-btn-3 {
        position: fixed;
        padding-left: 13px;
        padding-right: 7px;
        background-color: #ffe266;
        width: inherit;
        font-size: 13px;
        color: #354048;
        z-index: 99;
      }

      .share-group {
        position: absolute;
        right: 10px;
        top: 25px;
        line-height: 1;
        font-size: 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
        z-index: 99;
        border-radius: 16px;
        height: 32px;
        .group_wrap {
          overflow: hidden;
          width: 100%;
          height: 32px;
          border-radius: 16px;
          background: #fff;
        }
        .money_other {
          width: 60px;
          height: 23px;
          position: absolute;
          right: 0;
          top: -20px;
          border-raidus: 40px;
          font-size:12px;
          font-family:PingFangSC-Regular;
          color:rgba(53,64,72,1);
          line-height:18px;
          text-align: center;
          z-index: 100;

          img {
            width: 60px;
            height: 23px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: -1;
          }
        }
        &.fixed {
          position: fixed;
        }

        .u-btn {
          position: relative;
          line-height: 18px;
          font-size: 12px;
          color: @font-color-default;

          &:first-child {
            padding: 8px 10px 6px 12px;
          }

          &:last-child {
            padding: 8px 13px 6px 10px;
          }

          &.home,
          &.share {
            background: #fff;

            &:active {
              background: #f1f1f1;
            }
          }
          &.type_2 {
            padding: 8px 10px 6px 12px;
          }
          &.type_3 {
            padding: 6px 11px 6px 10px;
          }
          &.share:after {
            content: " ";
            display: block;
            position: absolute;
            right: 100%;
            top: 8px;
            background: #d8d8d8;
            width: 1px; /* no */
            height: 18px;
          }

          &.invite,
          &.money {
            height: 32px;
            padding: 0px 15px 0px 12px;
            background: #ffe266;
          }
        }
      }
    }

    & .container {
      /*flex: 1 1 auto;*/
      /*overflow: hidden;*/
      /*overflow-y: scroll;*/
      /*-webkit-overflow-scrolling: touch;  !* 针对 overflow: scroll; 在ios中卡顿问题 *!*/
    }

    & .module {

      .module-title {
        margin: 0 15px;
        font-size: 18px;
        color: #929292;
        font-weight: 600;
        
        /*关于塔主标签*/
        /*margin-bottom: 30px;
        position: relative;
        
        .module-title-tip{
        	padding: 0 6px;
        	font-size: 16px;
        	height: 22.5px;
        	line-height: 22.5px;
        	position: absolute;
        	bottom: -22.5px;
        	left: 50%;
        	transform: translateX(-50%);
        	color: #D7AB70;
        	font-weight: normal;
        	background: #fff;
        	
        }
        .module-title-tip-line{
        	position: absolute;
        	bottom: -11.5px;
        	width: 100%;
        	height: 0.5px;
        	background: #D7AB70;
        }*/

        & p {
          display: block;
					font-size:18px;
          padding: 30px 0 15px 20px;
					line-height:22px;
					position:relative;
					
					&::before{
						content:'';
						display:block;
						position:absolute;
						top:32px;
						left:5px;
						width:5px;
						height:17px;
						background-color:#ffe266;
					}
        }
      }
      .module-content {
        .community-item {
          margin-top: 25px;
        }

        &.h5-code {
          padding: 0 20px;
          /*font-size: 15px;*/
          word-wrap: break-word;
          width: 100%;
          box-sizing: border-box;

          & img {
            max-width: 100% !important;
            margin: 0 auto;
          }
        }
      }

      & .hr {
        height: 1px; /* no */
        background: #dcdcdc;
      }

      & .desc {
        color: #bcbcbc;
        font-size: 13px;
        padding: 20px 0;
        text-align: center;
      }
    }

    & .footer {
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

    & .how-to-play {
      margin-top: 30px;
      padding: 0 15px 25px;

      & img {
        border-radius: 6px;
        width: 100%;
        height: auto;
        vertical-align: middle;
        text-align: center;
      }
    }

    & .icon-home {
      width: 18px;
      height: 16px;
      margin-bottom: 5px;
    }

    & .home-mask {
      & .sell-container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 285px;
        background: #fff;
        border-radius: 6px;
        transform: translate(-50%, -50%);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        padding: 45px 0;
        font-size: 15px;
        color: #666666;

        & .Qr {
          width: 160px;
          height: 160px;
          font-size: 0;
          margin-bottom: 12px;
        }
        & img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          text-align: center;
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
</style>
