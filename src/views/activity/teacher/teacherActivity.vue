<template>
  <div class="p-body p-home-index teacher" >
      <img class="tea_top" src="./../../../assets/activity/teacher/teach_1.png" />
      <img class="tea_preface" src="./../../../assets/activity/teacher/teach_preface.png" />

      <!-- 导师阵容 -->
        <img class="tea_tit1" src="./../../../assets/activity/teacher/teach_tit_1.png" />
        <img class="tea_teachers" src="./../../../assets/activity/teacher/teach_teachers.png" />

      <!-- 大咖推荐 -->
        <img class="tea_tit2" src="./../../../assets/activity/teacher/teach_tit_2.png" />
        <img class="tea_recommend" src="./../../../assets/activity/teacher/teach_recommend.png" />

      <!-- 必修课表 -->
        <img class="tea_tit3" src="./../../../assets/activity/teacher/teach_tit_3.png" />

      <div class="buyBlo ">
        <img class="blo_warp" src="./../../../assets/activity/teacher/teach_ requ1.png" />

        <div class="blo_tobuy_cont">
          <p class="tit">- 第一眼就用自信的气场吸引Ta -</p>
          <div class="cont_img ">
            <img   src="./../../../assets/activity/teacher/te_req_1_1.png" />
            <div class="blo_btn" @click.stop="buy(1)"></div>
          </div>
          <div class="cont_img two">
            <img  src="./../../../assets/activity/teacher/te_req_1_2.png" />
            <div class="blo_btn" @click.stop="buy(2)"></div>
          </div>
        </div>
      </div>
      <div class="buyBlo two">

        <img class="blo_warp" src="./../../../assets/activity/teacher/teach_ requ2.png" />

        <div class="blo_tobuy_cont">
          <p class="tit">- 快速找准自己的发展道路 -</p>
          <div class="cont_img three">
            <img  src="./../../../assets/activity/teacher/te_req_2_1.png" />
            <div class="blo_btn" @click.stop="buy(3)"></div>
          </div>
          <div class="cont_img four">
            <img  src="./../../../assets/activity/teacher/te_req_2_2.png" />
            <div class="blo_btn" @click.stop="buy(4)"></div>
          </div>
        </div>
      </div>
      <div class="buyBlo three">

        <img class="blo_warp" src="./../../../assets/activity/teacher/teach_ requ3.png" />

        <div class="blo_tobuy_cont">
          <p class="tit">- 提高工作效率，告别加班 -</p>
          <div class="cont_img five">
            <img  src="./../../../assets/activity/teacher/te_req_3_1.png" />
            <div class="blo_btn" @click.stop="buy(5)"></div>
          </div>
          <div class="cont_img six">
            <img  src="./../../../assets/activity/teacher/te_req_3_2.png" />
            <div class="blo_btn" @click.stop="buy(6)"></div>
          </div>
        </div>
      </div>
      <div class="buyBlo four">
        <img class="blo_warp" src="./../../../assets/activity/teacher/teach_ requ4.png" />
        <div class="blo_tobuy_cont">
          <p class="tit">- 掌握高管思考方式 -</p>
          <div class="cont_img seven">
            <img  src="./../../../assets/activity/teacher/te_req_4_1.png" />
            <div class="blo_btn" @click.stop="buy(7)"></div>
          </div>
          <div class="cont_img eight">
            <img  src="./../../../assets/activity/teacher/te_req_4_2.png" />
            <div class="blo_btn"  @click.stop="buy(8)"></div>
          </div>
        </div>
      </div>
      <!-- 学员评价 -->
      <img class="tea_tit4" src="./../../../assets/activity/teacher/teach_tit_5.png" />
      <img class="tea_evaluate" src="./../../../assets/activity/teacher/teach_evaluate.png" />
      <!-- 适合人群 -->
      <img class="tea_tit5" src="./../../../assets/activity/teacher/teach_tit_5.png" />
      <img class="tea_fit" src="./../../../assets/activity/teacher/teach_fit.png" />
      <!-- 购买须知 -->
      <img class="tea_tit6" src="./../../../assets/activity/teacher/teach_tit_6.png" />
      <img class="tea_buy_txt" src="./../../../assets/activity/teacher/teach_buy_txt.png" />

      <div class="btns">
        <div class="joinde" v-if="allBuyItem && allBuyItem.isJoined===1">已经购买</div>
        <img class="btn" @click.stop="allBuy" src="./../../../assets/activity/teacher/teach_btn.png" v-else />
      </div>


      <!--支付弹窗-->
      <div class="pay_window" v-if="toPay && selectItem" @click.stop="closePya">
        <div class="pay_box" @click.stop="showPayWindow">
          <h3>{{selectItem.title}}</h3>
          <div class="tip">成功付款后，就可以开始你的职场提升之路了~</div>
          <div class="price">
            <span>社区价格</span>
            <span>¥ {{selectItem.joinPrice}}</span>
          </div>
          <div class="payment">
            <div class="payment_num">
              实付：<span>¥</span>
              <!--不使用优惠券和无优惠券-->
              <span>{{selectItem.joinPrice}}</span>
              <!--使用默认优惠券-->
            </div>
            <div class="payment_btn" @click.stop="isPay">立即支付</div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import { Swiper, SwiperItem } from 'vux'
import explore from '@/components/explore/explore'
import Scroller from '@/components/scroller'
import ListMixin from '@/mixins/list'
import {payApi, freePay} from '@/api/pages/pay'
import {getCommunityInfoApi} from '@/api/pages/pageInfo'

import { getBeaconsApi } from '@/api/pages/home'

  @Component({
    name: 'home-index',
    components: {
      Scroller
    },
    mixins: [ListMixin]
  })
  export default class HomeIndex extends Vue {
    communities = []
    // ******************* 已加入 **********************
    pickedParams = { // 页面所需参数
      tagId: 0
    }
    toPay = false

    payListMsg = [
      {
        tit: '做好体态管理，开启高端自己',
        oldMoney: 69,
        joinPrice: 39,
        id: 250,
        testId: '72454f7c3667b878cee45c82ddcbfa0b',
        teacherName:'阿珂'
      },
      {
        tit: '小白到表达高手的二十堂课',
        oldMoney: 99,
        joinPrice: 49,
        id: 402,
        testId: '44bbd91394eda5390e94fc36da196250',
        teacherName:'龙兄'
      },
      {
        tit: '职场选择力：如何让每一步抉择都不走弯路',
        oldMoney: 199,
        joinPrice: 99,
        id: 93,
        testId: '523b01c2f78c69e1d2817570d395e510',
        teacherName:'七芊'
      },
      {
        tit: '掌控人生的20堂职场课',
        oldMoney: 99,
        joinPrice: 49,
        id: 239,
        testId: 'c7bc966d746c223b0f00325b6b2f1de4',
        teacherName:''
      },
      {
        tit: 'PPT小白成长训练营',
        oldMoney: 99,
        joinPrice: 49,
        id: 258,
        testId: 'add6b630bcefc6a49c46fcc60c2b7e03',
        teacherName:'三顿'
      },
      {
        tit: '小白如何逆袭成为月入10w的全能写手',
        oldMoney: 69,
        joinPrice: 39,
        id: 260,
        testId: '74779b9a2d749cf0567a9ac2afd4ec70',
        teacherName: 'aida'
      },
      {
        tit: '公众号裂变涨粉实训营',
        oldMoney: 99,
        joinPrice: 49,
        id: 254,
        testId: '591d4be8b097f00593c20fc169f87aea',
        teacherName: '书记'
      },
      {
        tit: '用得上的商学课',
        oldMoney: 99,
        joinPrice: 49,
        id: 312,
        testId: '274a53987412b68fd95c3add3eaa45d4',
        teacherName: '路聘'
      },{
        tit: '一键购买198',
        oldMoney: 99,
        joinPrice: 49,
        id: 312,
        testId: '02b81714611b454f2daa2ea5fa53b5be',
        teacherName: '一键购买198'
      }
    ]

    selectItem = {}
    allBuyItem = {}

    allBuy () {
      console.log('allBuy')
      this.selectItem = this.allBuyItem
      this.payIn()
    }

    buy (index) {
      console.log(index)

      let item = this.payListMsg[index-1]
      this.selectItem = item

      getCommunityInfoApi({communityId: item.testId}).then(res=>{
        console.log(res)
        if(res.isJoined!==1){
          //this.toPay = true
          this.selectItem.joinPrice = res.joinPrice
          this.selectItem.isCourse = res.isCourse
          this.selectItem.communityId = res.communityId
          this.payIn()
        }else {
          if(res.isCourse === 3){
            this.$router.replace(`/introduce2/${item.communityId}/community`)
          }else {
            this.$router.replace(`/introduce/${item.communityId}/community`)
          }
        }
      })
      
    }

    closePya(){
      this.toPay = false
    }

    created () {
      getCommunityInfoApi({communityId: this.payListMsg[8].testId}).then(res=>{
        console.log(res)
        this.allBuyItem = res
      })
    }

    // ------------------------------------------------
    /**
     * 页面入口初始
     */

    payOrFree () {
      let that = this
      this.toPay = true;
    }

    async init () {
    }
    // ------------------------------------------------
    async payIn () {

      const params = await payApi({
        productId: this.selectItem.communityId,
        productType: 1,
        userCouponId: 0
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
            self.$vux.toast.text(`已购买成功${self.selectItem.isCourse}${self.selectItem.communityId}`, 'bottom')
            if(self.selectItem.isCourse === 3){
              this.$router.replace(`/introduce2/${self.selectItem.communityId}/community`)
            }else {
              this.$router.replace(`/introduce/${self.selectItem.communityId}/community`)
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
    padding-bottom: 100px;
    .buyBlo {
      width: 356px;
      height: 752px;
      position: relative;
      margin: 0 auto;
      margin-bottom: 39px;
      .tit {
        font-size: 16px;
        font-family:SourceHanSansCN-Normal;
        font-weight: 400;
        color: rgba(18,2,0,1);
        text-align: center;
        display: none;
      }
      .blo_warp {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
      }
      .blo_tobuy_cont {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        padding-top: 70px;
        box-sizing: border-box;
        .cont_img {
          width: 323px;
          height: 330px;
          margin: 0 auto;
          position: relative;
          &.two {
            height: 316px;
            margin-top: 11px;
          }
          &.three {
            height: 293px;
          }
          &.four {
            margin-top: -20px;
            height: 361.5px;
          }
          &.five {
            //height: 310px;
            height: auto;
          }
          &.six {
            height: 331px;
            margin-top: 15px;
          }
          &.seven {
            height: 328px;
          }
          &.eight {
            height: 293.5px;
            margin-top: 15px;

          }
          img {
            width: 100%;
            height: 100%;
          }
          .blo_btn {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 130px;
            height: 60px;
          }
        }
      }

      &.two {
      height: 730.5px;

      }
      &.three {
      height: 749px;

      }
      &.four {
      height: 725px;

      }
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
      .btn {
        width: 264px;
        height: 67.5px;
        margin: 0 auto;
        display: block;
        /*margin-top: 29px;
        margin-bottom: 22px;*/
      }
      .joinde {
        font-size:40px;
        font-family:SourceHanSansCN-Bold;
        font-weight:bold;
        color:rgba(255,254,254,1);
      }
    }
    
    .tea_tit6 {
      width: 175px;
      height: 55.5px;
      margin: 19px auto;
    }
    .tea_tit5 {
      width: 173.5px;
      height: 56.5px;
      margin: 28px auto;
    }
    .tea_tit4 {
      width: 183.5px;
      height: 54.5px;
      margin: 28px auto;
    }
    .tea_tit3 {
      width: 180.5px;
      height: 66px;
      margin: 28px auto;
    }
    .tea_tit2 {
      width: 183.5px;
      height: 54.5px;
      margin: 28px auto;
    }
    .tea_tit1 {
      width: 183.5px;
      height: 54.5px;
      margin:31px auto 28px auto;
    }

    .tea_preface {
      width: 356px;
      height: 626.5px;
    }
    .tea_teachers {
      width: 360px;
      height: 382px;
    }
    .tea_recommend {
      width: 356px;
      height: 789.5px;
    }
    .tea_buy_txt {
      width: 356px;
      height: 270px;
    }
    .tea_fit {
      width: 356px;
      height: 220px;
    }
    .tea_evaluate {
      width: 356px;
      height: 505px;
    }

    img {
      display: block;
      margin: 0 auto;
      width: 100%;
      height: auto;
    }
  }

  .pay_window{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,1);
    .pay_box{
      animation: 0.4s ease-in-out window-fade-in;
      box-sizing: border-box;
      width: 375px;
      height: 207px;
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
