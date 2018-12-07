<template>

  <!-- 大咖介绍页 -->
  <div ref="body" class="big-shot-introduce">

    <div class="container" ref="big-shot-introduce-container" :class="{ 'no-pdb': !completelyShow }">
      <div class="header">
        <community-card ref="headCard" :community="pageInfo" :type="2" />
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
      </div>
      
      <!-- 介绍和试读tab -->
      <div class="tabTitle" v-if="pageInfo.isCourse === 4">
        <a href="#" :class="{'item': showType === 'about'}" @click.prevent.stop="toggle(1)"><span>关于课程</span></a>
        <a href="#" :class="{'item': showType === 'tryCourse'}" @click.prevent.stop="toggle(0)"><span>试读</span></a>
      </div>
      
      <div class="module"  style="min-height: 70vh" v-if="pageInfo.isCourse === 3 || showType === 'about'">
        <div class="module-title" v-show="pageInfo.isCourse !== 4">
          <p>关于灯塔</p>
        </div>
        <div class="module-content h5-code" v-if="pageInfo.intro" v-html="pageInfo.intro" >
        </div>
      </div>
      <div class="how-to-play" v-show="pageInfo.isCourse !== 4 || showType === 'about'">
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
          ></dynamic>
        </div>
        <div class="desc">
          加入灯塔，即可解锁更多内容~
        </div>
      </div>

      <!-- 试读内容 -->
      <div class="module relevant" v-if="pageInfo.tryCourses && pageInfo.tryCourses.length>0 && pageInfo.isCourse === 3 || showType === 'tryCourse'">
        <div class="module-title" v-show="pageInfo.isCourse !== 4">
          <p>试读内容</p>
          <div class="hr"></div>
        </div>
        <div class="module-content">
          <div class="attempt_list"  >
            <div class="attempt_block" v-for="item,index in pageInfo.tryCourses" @click.stop="toLesson(item.id)">
              <img class='blo_left' :src="item.coverPicture" />
              <div class='blo_center'>{{item.title}}</div>
              <div class='blo_right'>试读</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!--底部支付按钮-->
    <payment 
      v-if="completelyShow"
      :pageInfo="pageInfo" 
      :isPassTime="isPassTime"
      @payOrFree="payOrFree"
      @freeJoin="freeJoin"
      @freeIn="freeIn">
    </payment>

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
        <p>长按识别二维码，关注公众号可</p>
        <p>获取{{pageInfo.isSell && pageInfo.isSell === 2 ? '专属海报，邀请好友一起学习' : '专属海报，及查询奖励'}}</p>
      </div>
    </div>

    <hint-msg 
      :isHintShow = isHintShow 
      :msg = hintData
      :type = 2
      @cloHint = cloHint
      @hintSucFuc = hintSucFuc
    ></hint-msg>
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
  import CommunityCard from '@/components/communityCard_v2'
  import dynamic from '@/components/dynamic/dynamic'
  import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
  import hintMsg from '@/components/hintMsg/hintMsg'
  import {getCommunityInfoApi, countCodeApi} from '@/api/pages/pageInfo'
  import WechatMixin from '@/mixins/wechat'
  import {payApi, freePay} from '@/api/pages/pay'
  import ShareDialog from '@/components/shareDialog/ShareDialog'
  import payment from '@/components/payment/payment'
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
      ShareDialog,
      payment
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
      	console.log("333333333333",this.pageInfo.isJoined,this.pageInfo.isAuthor)
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
      },
      /* 是否错过训练营可加入时间 */
      isPassTime () {
        let {startTime, endTime} = this.pageInfo
        let timestamp = Date.parse(new Date())
        return timestamp > startTime*1000
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
    showShare = false // 显示分享弹框
    showSell = false // 显示分销弹框
    pageInfo = {}
    dynamicList = []
    disableOperationArr = ['comment', 'praise']
    completelyShow = true // 控制介绍页显示模块
    el = ''
    qrSrc = ''
    isEndSock = false  //已结束的锁   
    usedUserCouponId = 0    //支付时使用的优惠券id
    selectCouponItem = {}   //当前选择的优惠券信息
    selectedPrice = ''    //选择其他优惠券后的价格
    toPay = false     //是否调起支付窗口
    showType = 'about' // 训练营课程tab栏显示
    trainingCampAlert = false // 训练营弹窗开关

    endPayType = null //已结束 加入时候的状态
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
    
    copy () {
      let text = this.pageInfo.consultantCustomerWechat
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', text)
      document.body.appendChild(input)
      input.setSelectionRange(0, 9999)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        console.log('复制成功')
      }
      document.body.removeChild(input)
    }
    
    close () {
      this.trainingCampAlert = false
    }

    cloHint (){
      this.isHintShow = false
    }

    openHint (){
      this.isHintShow = true
    }
    
    toggle (classfy) {
      if (classfy === 1) {
        this.showType = 'about'
      } else {
        this.showType = 'tryCourse'
      }
    }

    pxToRem (_s) {
      // 匹配:20px或: 20px不区分大小写
      const reg = /(\:|: )+(\d)+(px)/gi
      let newStr = _s.replace(reg, function (_x) {
        _x = _x.replace(/(\:|: )/, '').replace(/px/i, '')
        return ':' + parseFloat(_x) / 32 + 'rem'
      })
      return newStr
    }

    closePya(){
      this.toPay = false
    }

    showPayWindow(){}


    isPay(){
      console.log('=-=isPay-=')
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
      let that = this
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
        userCouponId:this.usedUserCouponId,
        productType: 1
      }).then((res) => {
        that.toPay = false;   //关闭支付窗口
        sessionStorage.removeItem("coupon");
        if (that.pageInfo.isCourse === 4) {
          that.trainingCampAlert = true
          that.pageInit()
        } else {
          that.$vux.alert.show({
            title: '加入成功',
            content: '快去灯塔里和大家一起进步吧',
            buttonText: '好的',
            onHide () {
              that.pageInit()
            }
          })
        }
      }).catch((e) => {
        that.$vux.toast.text(e.message, 'bottom')
      })
    }
    toHome () {
      this.$router.replace(`/index`)
    }

    async payIn () {
      const params = await payApi({
        productId: this.pageInfo.communityId,
        productType: 1,
        userCouponId: this.usedUserCouponId
      })
      const arr = Object.keys(params || {})

      console.log(arr,typeof WeixinJSBridge)
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
        if (this.pageInfo.isCourse === 4) {
          this.trainingCampAlert = true
        }
        this.pageInit()
      }
    }
    /* 支付函数 */
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
              default:
                self.$store.dispatch('show_qr', {type: 3})
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
      // wxUtil.reloadPage()
      if (this.$route.name === 'introduce-detail2') { // 是否介绍页
        this.completelyShow = false
      }
      const { code='' } = this.$route.query
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
        //  const str = realName ? realName + (career ? '|' + career : '') : ''
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

      console.log(this.$route)
      const res = await getCommunityInfoApi({communityId, data: {applyId}})
      let Selectcoupon = sessionStorage.getItem("coupon")

      this.qrSrc = res.sellImg
      this.pageInfo = res

      //从优惠券页面列表页过来的，判断是否调起支付
      if(Selectcoupon){
        this.toPay = true
        let CouponItem = sessionStorage.getItem("coupon");
        this.selectCouponItem = JSON.parse(CouponItem);
        if(this.selectCouponItem.userCouponId!==0){
          let paynum=this.pageInfo.joinPrice-this.selectCouponItem.coupon.discount;
          this.selectedPrice = this.pageInfo.joinPrice>this.selectCouponItem.coupon.discount?paynum.toFixed(2):0;
        }else{
          this.selectedPrice =this.pageInfo.joinPrice
        }
      }

      // 是否已入社
      if (this.completelyShow && this.isJoinAgency) {
        if(res.isCourse === 3 || res.isCourse === 4){
          this.$router.replace(`/introduce2/${communityId}/community`)
        }else {
          this.$router.replace(`/introduce/${communityId}/community`)
        }
        return
      }else {
        //优惠卷进入。判断是否旧的
        if(res.isCourse !== 3 && res.isCourse !== 4){
          this.$router.replace(`/introduce/${communityId}`)
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
            _this.freeJoin()
          }
        }
      })
    }

    mounted () {
    }

    toLesson (id) {
      this.$router.push({path:`/Lesson?id=${id}&isTry=1&communityId=${this.pageInfo.communityId}`})
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
  @import "../../styles/dprPx";

  .joinHint {
    .fontSize(14);
    font-family: PingFangSC-Light;
    color: rgba(188,188,188,1);
    line-height: 18px;
    margin-bottom: 34px;
    text-align: center;
  } 
  .big-shot-introduce {
   	height: 100%;
    padding-bottom: 55px;
    box-sizing: border-box;
    overflow-y: auto;
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
        .fontSize(15);
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
        .fontSize(13);
        color: #354048;
        z-index: 99;
      }

      & .share-btn-3 {
        position: fixed;
        padding-left: 13px;
        padding-right: 7px;
        background-color: #ffe266;
        width: inherit;
        .fontSize(13);
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
          .fontSize(12);
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
          .fontSize(12);
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
    
    /* 训练营（type：4）tab栏样式 */
    .tabTitle{
      margin-bottom: 20px;
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #DCDCDC;/*no*/
      width: 100%;
      height: 40px;
      background: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      a{
        position: relative;
        display: inline-block;
        width: 50%;
        text-align: center;
        color: #929292;
        font-size: 15px;
        font-weight: 300;
        height: 40px;
        line-height: 40px;
      }
      .item{
        color: #354048;
        font-weight:500; 
        &::after{
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background-color: #FFE266;
        }
      }
    }

    & .module {

      .module-title {
        margin: 0 15px;
        .fontSize(18);
        color: #929292;
        font-weight: 600;
        & p {
          display: block;
					.fontSize(18);
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
          word-wrap: break-word;
          width: 100%;
          box-sizing: border-box;
          & img {
            max-width: 100% !important;
            margin: 0 auto;
          }
        }

        .attempt_list {
          display: flex;
          flex-direction: column;
          margin: 15px 15px 15px 20px;
        }
        .attempt_block {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          height:40px;
          margin-bottom: 30px;
          .blo_left {
            width:70px;
            height:39px;
            border-radius:3px;

          }
          .blo_center {
            flex: 1;
            margin: 0 15px;
            .fontSize(14);
            font-family: PingFangSC-Regular;
            color: rgba(53,64,72,1);
            line-height: 18px;
            .setEllipsisLn()
          }
          .blo_right {
            width: 36px;
            height: 22px;
            background: rgba(255,255,255,1);
            border-radius: 3px;
            border: 0.5px solid rgba(188,188,188,1);
            text-align: center;
            .fontSize(12);
            font-family: PingFangSC-Light;
            color: rgba(146,146,146,1);
            line-height: 22px;
          }
        }
      }


      & .hr {
        height: 1px; /* no */
        background: #dcdcdc;
      }

      & .desc {
        color: #bcbcbc;
        .fontSize(13);
        padding: 20px 0;
        text-align: center;
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
        .fontSize(15);
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
        .fontSize(18);
        color:rgba(53,64,72,1);
        line-height:22px;
        margin-bottom: 10px;
      }
      /*支付副标题*/
      .tip{
        .fontSize(13);
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
          .fontSize(15);
          color:rgba(102,102,102,1);
          line-height:21px;
        }
      }
      /*支付优惠券处*/
      .coupon_price{
        display: flex;
        justify-content: space-between;
        >span{
          .fontSize(15);
          color:rgba(102,102,102,1);
          line-height:21px;
        }
        .coupon_price_right{
          display: flex;
          align-items: center;
          >span{
            display: inline-block;
            .fontSize(15);
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
          .fontSize(13);
          color:rgba(53,64,72,1);
          span{
            color:rgba(250,106,48,1);
            &:nth-child(1){
              .fontSize(13);
            }
            &:nth-child(2){
              padding-left: 4px;
              .fontSize(18);
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
          .fontSize(16);
          color:rgba(53,64,72,1); 
        }
      }
      
    }
  }
</style>
