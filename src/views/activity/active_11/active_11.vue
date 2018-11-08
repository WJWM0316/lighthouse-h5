<template>
  <div class="p-body p-home-index teacher"  >
    <div class="first" >
      <!-- <img class="first_bg" src="./../../../assets/activity/active_11/first_bg.png" /> -->
      <img class="first_top" src="./../../../assets/activity/active_11/first_top.png" />
      <div class="text">1元解锁5门职场精品课程  {{statistics.length}}</div>

      <div class="first_cont">
        <img class="first_cont_icon"  src="./../../../assets/activity/active_11/first_cont.png" />
        <img class="first_btn" @click.stop="openPop(2)" src="./../../../assets/activity/active_11/first_btn.png" />
        <div class="first_hint">*本活动为小灯塔福利活动，报名完成，概不退款</div>
        <img class="down" @click.stop="toNext('second')" src="./../../../assets/activity/active_11/down.png" />
      </div>
    </div>

    <div class="second" >
      <img class="second_1" src="./../../../assets/activity/active_11/second_cont_1.png" />
      <img class="second_2" src="./../../../assets/activity/active_11/second_cont_2.png" />
      <img class="second_3" src="./../../../assets/activity/active_11/second_cont_3.png" />

      <div class="btns"  v-if="showBtn">
        <img class="btn_bg" src="./../../../assets/activity/active_11/btn_bg.png"  />
        <img class="left" @click.stop="openPop(1)" src="./../../../assets/activity/active_11/btn_left.png"  />
        <img class="right" @click.stop="openPop(2)" src="./../../../assets/activity/active_11/btn_right.png"  />
      </div>
    </div>

  <!--  -->
    <div class="pop"  v-if="isShow">
      <div class=" buy_block buy_left" v-if="buy_state==='left'">
        <img class="right" src="./../../../assets/activity/active_11/pop_465.png"  />
        <div class="clo" @click="closePop"></div>
        <div class="buy" @click="toBuy(1)"></div>
      </div>
      <div class=" buy_block buy_right" v-if="buy_state==='right'">
        <img class="right" src="./../../../assets/activity/active_11/pop_1.png"  />
        <div class="clo" @click="closePop"></div>
        <div class="buy" @click="toBuy(2)"></div>
      </div>
      <div class="buy_success" v-if="buy_state==='success_1'">
        <img class="success_1" src="./../../../assets/activity/active_11/test_success_1.png"  />
      </div>

      <div class="buy_success" v-if="buy_state==='success_465'">
        <img class="success_465" src="./../../../assets/activity/active_11/success_465.png"  />
      </div>
    </div>


  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import explore from '@/components/explore/explore'
import Scroller from '@/components/scroller'
import ListMixin from '@/mixins/list'
import {getCommunityInfoApi} from '@/api/pages/pageInfo'
import {payApi, freePay} from '@/api/pages/pay'
import wxUtil from '@/util/wx/index'
import WechatMixin from '@/mixins/wechat'

import { getBeaconsApi } from '@/api/pages/home'
  @Component({
    name: 'home-index',
    components: {
      Scroller,
    },
    mixins: [ListMixin,WechatMixin]
  })
  export default class HomeIndex extends Vue {
    buy_state = 'left'
    isShow = false
    pickedParams = { // 页面所需参数
      tagId: 0
    }

    toPay = false
    nowPage = 'first'
    demo01_index = 0
    statistics = {}

    //正式c18c80c6c47c3047356b5b733f0bf784
    communityId = '02b81714611b454f2daa2ea5fa53b5be'
    communityId2 = ''
    communityMsg = {}
    communityMsg2 = {}
    nowPayStatus = ''
    abBottom = 0
    showBtn = false
    handleScroll(e){
      let scroll = e.target.scrollTop || 0
      let firstPageHeight = document.body.clientHeight-50
      if(scroll>firstPageHeight){
        this.showBtn = true
      }else {
        this.showBtn = false
      }
    }

    created () {

      let that = this
      if(that.$route.query){
        that.statistics = that.$route.query
      }
      window.addEventListener('scroll', this.handleScroll, true);

      getCommunityInfoApi({
        communityId: that.communityId,
        data:{
          userKey: this.statistics && this.statistics.userKey?this.statistics.userKey:'',
          bundingId: this.statistics && this.statistics.bundingId?this.statistics.bundingId:'',
        }
      })
        .then(res=>{
          that.communityMsg = res
          that.communityId2 = res.equivalenceCommunityId || ''
          that.wechatShare({
            'titles': '1元解锁5门职场精品课程',
            'title': '1元解锁5门职场精品课程',
            'desc': '升职加薪也可以加入购物车，小灯塔双十一1元帮你清空！',
            'imgUrl': 'https://cdnstatic.zike.com/Uploads/static/beacon/lighthouse-logo.png',
            'link': location.origin + `/beaconweb/#/active_11`
          })
          console.log(res.isJoined)
          if(res.isJoined===1){
            console.log(111)
            this.isShow = true
            this.buy_state = 'success_1'
          }
        })
        .then(()=>{
          return getCommunityInfoApi({
            communityId: that.communityId2,
            data:{
              userKey: this.statistics && this.statistics.userKey?this.statistics.userKey:'',
              bundingId: this.statistics && this.statistics.bundingId?this.statistics.bundingId:'',
            }
          })
        })
        .then(res=>{
            that.communityMsg2 = res
            // if(res.isJoined===0){
            //   console.log(111)
            //   this.isShow = true
            //   this.buy_state = 'success_465'
            // }
        })
    }

    toBuy (type) {
      let communityMsg = type===2?this.communityMsg : this.communityMsg2
      let id = type===2?this.communityId:this.communityId2
      this.nowPayStatus = type

      if(communityMsg.isJoined!==1 && communityMsg.isAuthor !== 1){
        this.payIn(id)
      }else {
        this.$vux.toast.text(`已购买`, 'bottom')
        if(communityMsg.isCourse === 3){
          this.$router.push(`/introduce2/${this.selectItem.communityId}/community`)
        }else {
          this.$router.push(`/introduce/${this.selectItem.communityId}/community`)
        }
      }
    }

    openPop (type) {
      this.isShow = true
      if(type===1){
        this.buy_state = 'left'
      }else {
        this.buy_state = 'right'
      }
    }

    closePop(){
      console.log('closePop')
      this.isShow = false
    }

    async payIn (communityId) {

      console.log(communityId)
      const params = await payApi({
        productId: communityId,
        productType: 1,
        userCouponId: 0,
        messageId: this.statistics && this.statistics.messageId?this.statistics.messageId:'',
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
        this.isPay = false
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
            self.isShow = true
            self.$vux.toast.text(`已购买成功`, 'bottom')
            if(self.nowPayStatus == 2){
              self.buy_state = 'success_1'
            }else {
              self.buy_state = 'success_465'
            }

            if(self.selectItem.communityId != self.allBuyCommunityId){
              if(self.selectItem.isCourse === 3){
                self.$router.push(`/introduce2/${self.selectItem.communityId}/community`)
              }else {
                self.$router.push(`/introduce/${self.selectItem.communityId}/community`)
              }
            }else {
              self.toPay = true
            }
            
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            self.$vux.toast.text('已取消支付', 'bottom')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            self.$vux.toast.text('支付失败，请重新购买', 'bottom')
          }
        }
      )
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/variables";
  @import "../../../styles/mixins";
  @import "../../../styles/dprPx";
  .teacher {
    background: #FFE107;
    height: 100vh;
    position: relative;
    .toNext {
      width: 100px;
      height: 50px;
      position: absolute;
      bottom: 10px;
      left: 20%;

      border: 1px solid #cccccc;
    }
    .first {
      position: relative;
      padding-top: 15px;
      box-sizing: border-box;
      .first_bg {
        width: 370px;
        height: auto;
        display: block;
      }
      .first_top {
        width: 343.5px;
        height: auto;
        display: block;
      }
      .text {
        height:27.5px;
        line-height:27.5px;
        background:rgba(53,46,43,1);
        width: 100%;
        display: block;
        font-size:16px;
        font-family:SourceHanSansCN-Bold;
        font-weight:bold;
        color:rgba(255,225,7,1);
        text-align: center;
        margin: 15px auto 20px auto;
      }

      .down {
        width: 20px;
        height: auto;
        margin-top: 8px;
        margin-bottom: 8px;
      }

      .first_hint {
        font-size:13px;
        font-family:SourceHanSansCN-ExtraLight;
        font-weight:200;
        text-align: center;
        color:rgba(53,46,43,1);
      }
      .first_cont {
        
      }
      .first_cont_icon {
        width: 338px;
        height: 88px;
      }
      .first_btn {
        width: 124.5px;
        height: auto;
        margin: 15px auto 10px auto;
      }
    }
    .second {
      width: 100%;
      .second_3 {
        margin-bottom: 80px;
      }
    }
    .btns {
      width: 100%;
      height:64px;
      position: fixed;
      z-index: 100;
      left: 0;
      bottom: 0px;
      //background: #FFE107;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn_bg {
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
      }
      .left {
        width: 150px;
        height: 41.5px;
        position: absolute;
        left: 18.75px;
        top: 11px;
        z-index: 10;
      }
       .right {
        width: 125px;
        height: 41.5px;
        position: absolute;
        right: 31.25px;
        top: 11px;
        z-index: 10;
      }

      .joinde {
        height: 60px;
        line-height: 60px;
        font-size:16px;
        font-family:SourceHanSansCN-Bold;
        font-weight:bold;
        color:rgba(255,254,254,1);
        width: 100%;
        position: absolute;
        bottom: 0;
        background: #D35D4A;
        text-align: center;
      }
    }

    img {
      display: block;
      margin: 0 auto;
      width: 100%;
      height: auto;
    }
  }

  .pop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    .buy_state {
      
    }
    .buy_block {
      width: 305px;
      height: 300px;
      background: #cccccc;
      position: relative;
      .clo {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 4px;
        top: 4px;
      }
      .buy {
        width: 150px;
        height: 38px;
        position: absolute;
        bottom: 20px;
        left: 50%;
        margin-left: -75px;
      }
    }
    .buy_success {
      background: #FFE107;
      position: relative;
      width: 100%;
      height: 100%;;
      display: flex;
      justify-content: center;
      align-items: center;
      .success_1 {
        width: 325px;
        height: 425px;
      }
      .success_465 {
        width: 326px;
        height: 281.5px;
      }
    }
  }
</style>
