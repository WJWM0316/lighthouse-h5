<template>
  <div class="p-body p-home-index teacher">
    <div class="first" v-if="nowPage==='first'">
      <img class="first_bg" src="./../../../assets/activity/active_11/first_bg.png" />
      <img class="first_btn" @click.stop="openPop(2)" src="./../../../assets/activity/active_11/first_btn.png" />

      <span class="toNext" @click="toNext('second')">xxxxx</span>
    </div>

    <div class="second" v-else>
      <img class="second_1" src="./../../../assets/activity/active_11/second_cont_1.png" />
      <img class="second_2" src="./../../../assets/activity/active_11/second_cont_2.png" />
      <img class="second_3" src="./../../../assets/activity/active_11/second_cont_3.png" />

      <div class="btns">
        <img class="btn_bg" src="./../../../assets/activity/active_11/btn_bg.png"  />
        <img class="left" @click.stop="openPop(1)" src="./../../../assets/activity/active_11/btn_left.png"  />
        <img class="right" @click.stop="openPop(2)" src="./../../../assets/activity/active_11/btn_right.png"  />
      </div>
    </div>


    <div class="pop" v-if="isShow">
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
        <img class="success_1" src="./../../../assets/activity/active_11/success_1.png"  />
      </div>

      <div class="buy_success" v-if="buy_state==='success_465'">
        <img class="success_1" src="./../../../assets/activity/active_11/success_465.png"  />
      </div>
    </div>



      <!--支付弹窗-->
      <div class="pay_window" v-if="false">
        <div class="pay_cont">
          <!-- <img class="close" @click.stop="closePya" src="./../../../assets/activity/active_11/clo.png" /> -->
          <!-- <img class="code" src="./../../../assets/activity/active_11/code.png" /> -->
          <p>扫描二维码或者搜索zike04，</p>
          <p>添加好友，备注<span>【礼包】</span>领取福利</p>
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
    // ******************* 已加入 **********************
    pickedParams = { // 页面所需参数
      tagId: 0
    }

    toPay = false
    nowPage = 'first'
    demo01_index = 0
    statistics = {}

    communityId = '02b81714611b454f2daa2ea5fa53b5be'
    communityMsg = {}

    getSlideDirection(startX, startY, endX, endY) {
      var dy = startY - endY;
      //var dx = endX - startX;
      var result = 0;
      if(dy>0) {//向上滑动
          result=1;
      }else if(dy<0){//向下滑动
          result=2;
      }
      else
      {
          result=0;
      }
      return result;
    }
    //手指离开屏幕
    touchEnd(e) {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        switch (direction) {
            case 0:
                alert("未滑动！");
                break;
            case 1:
                alert("向上！")
                break;
            case 2:
                alert("向下！")
                break;
            case 3:
                alert("向左！")
                break;
            case 4:
                alert("向右！")
                break;
            default:
        }
    }

    created () {
      let that = this
      if(that.$route.query){
        that.statistics = that.$route.query
      }
      getCommunityInfoApi({communityId: that.communityId}).then(res=>{
        console.log(res)
        that.communityMsg = res
        that.wechatShare({
          'titles': '月薪5万的人都在学的职场必修课',
          'title': '月薪5万的人都在学的职场必修课',
          'desc': '如何快速找准自己的职业发展道路？如何提高工作效率告别加班？这一堂，全给你！',
          'imgUrl': 'https://cdnstatic.zike.com/Uploads/static/beacon/lighthouse-logo.png',
          'link': location.origin + `/beaconweb/#/teacherActivity`
        })
      })
    }

    toBuy (type) {
      let communityMsg = this.communityMsg
      if(communityMsg.isJoined!==1 && communityMsg.isAuthor !== 1){
        this.payIn()
      }else {
        if(communityMsg.isCourse === 3){
          this.$router.push(`/introduce2/${this.selectItem.communityId}/community`)
        }else {
          this.$router.push(`/introduce/${this.selectItem.communityId}/community`)
        }
      }
    }

    toNext (type) {
      if(type==='second'){
        this.nowPage = type
      }
    }

    openPop (type) {
      this.isShow = true
      if(type===1){
        this.buy_state = 'left'
      }else {
        this.buy_state = 'right'
        //this.buy_state = 'success_1'
      }
    }

    buy (index) {
      let item = this.payListMsg[index-1]
      this.selectItem = item

      getCommunityInfoApi({communityId: item.communityId}).then(res=>{
        this.selectItem.joinPrice = res.joinPrice
        this.selectItem.isCourse = res.isCourse
        this.selectItem.communityId = res.communityId
        if(res.isJoined!==1 && res.isAuthor !== 1){
          this.payIn()
        }else {
          if(res.isCourse === 3){
            this.$router.push(`/introduce2/${this.selectItem.communityId}/community`)
          }else {
            this.$router.push(`/introduce/${this.selectItem.communityId}/community`)
          }
        }
      })
      
    }

    closePop(){
      this.isShow = false
    }

    async payIn () {
      const params = await payApi({
        productId: this.communityId,
        productType: 1,
        userCouponId: 0,
        userKey: '',
        messageId: '',
        bundingId: '',
        //messageId: this.statistics && this.statistics.messageId?this.statistics.messageId:'',
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
            self.$vux.toast.text(`已购买成功`, 'bottom')
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
    .toNext {
      width: 100px;
      height: 50px;
      position: absolute;
      bottom: 10px;
      left: 20%;

      border: 1px solid #cccccc;
    }
    .first {
      height: 100vh;
      position: relative;
      .first_bg {
        width: 375px;
        // height: 667px;
        height: auto;
        display: block;
      }
      .first_btn {
        width: 125px;
        height: 42px;
        position: absolute;
        left: 50%;
        margin-left: -62.5px;
        bottom: 0px;
      }
    }
    .second {
      padding-bottom: 100px;
    }
    .btns {
      width: 100%;
      height: 100px;
      position: fixed;
      z-index: 100;
      left: 0;
      bottom: 0;
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
        height: auto;
        position: absolute;
        left: 18.75px;
        top: 30px;
        z-index: 10;
      }
       .right {
        width: 125px;
        height: auto;
        position: absolute;
        right: 31.25px;
        top: 30px;
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

      width: 235px;
      height: 249px;
      background: #cccccc;
      position: relative;
      .clo {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 4px;
        top: 4px;
        border: 1px solid #cccccc;
      }
      .buy {
        width: 140px;
        height: 30px;
        position: absolute;
        bottom: 20px;
        left: 50%;
        margin-left: -70px;
        border: 1px solid #cccccc;
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
    }
  }
</style>
