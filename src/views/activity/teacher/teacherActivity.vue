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
          <div class="cont_img " @click.stop="toDetail(1)">
            <img  src="./../../../assets/activity/teacher/te_req_1_1.png" />
            <div class="blo_btn" @click.stop="buy(1)"></div>
          </div>
          <div class="cont_img two" @click.stop="toDetail(2)">
            <img src="./../../../assets/activity/teacher/te_req_1_2.png" />
            <div class="blo_btn" @click.stop="buy(2)"></div>
          </div>
        </div>
      </div>
      <div class="buyBlo two">

        <img class="blo_warp" src="./../../../assets/activity/teacher/teach_ requ2.png" />

        <div class="blo_tobuy_cont">
          <p class="tit">- 快速找准自己的发展道路 -</p>
          <div class="cont_img three"  @click.stop="toDetail(3)">
            <img  src="./../../../assets/activity/teacher/te_req_2_1.png" />
            <div class="blo_btn" @click.stop="buy(3)"></div>
          </div>
          <div class="cont_img four"  @click.stop="toDetail(4)">
            <img  src="./../../../assets/activity/teacher/te_req_2_2.png" />
            <div class="blo_btn" @click.stop="buy(4)"></div>
          </div>
        </div>
      </div>
      <div class="buyBlo three">

        <img class="blo_warp" src="./../../../assets/activity/teacher/teach_ requ3.png" />

        <div class="blo_tobuy_cont">
          <p class="tit">- 提高工作效率，告别加班 -</p>
          <div class="cont_img five"  @click.stop="toDetail(5)">
            <img  src="./../../../assets/activity/teacher/te_req_3_1.png" />
            <div class="blo_btn" @click.stop="buy(5)"></div>
          </div>
          <div class="cont_img six"  @click.stop="toDetail(6)">
            <img  src="./../../../assets/activity/teacher/te_req_3_2.png" />
            <div class="blo_btn" @click.stop="buy(6)"></div>
          </div>
        </div>
      </div>
      <div class="buyBlo four">
        <img class="blo_warp" src="./../../../assets/activity/teacher/teach_ requ4.png" />
        <div class="blo_tobuy_cont">
          <p class="tit">- 掌握高管思考方式 -</p>
          <div class="cont_img seven"  @click.stop="toDetail(7)">
            <img  src="./../../../assets/activity/teacher/te_req_4_1.png" />
            <div class="blo_btn" @click.stop="buy(7)"></div>
          </div>
          <div class="cont_img eight"  @click.stop="toDetail(8)">
            <img  src="./../../../assets/activity/teacher/te_req_4_2.png" />
            <div class="blo_btn"  @click.stop="buy(8)"></div>
          </div>
        </div>
      </div>
      <!-- 学员评价 -->
      <img class="tea_tit4" src="./../../../assets/activity/teacher/teach_tit_4.png" />
      <img class="tea_evaluate" src="./../../../assets/activity/teacher/teach_evaluate.png" />
      <!-- 适合人群 -->
      <img class="tea_tit5" src="./../../../assets/activity/teacher/teach_tit_5.png" />
      <img class="tea_fit" src="./../../../assets/activity/teacher/teach_fit.png" />
      <!-- 购买须知 -->
      <img class="tea_tit6" src="./../../../assets/activity/teacher/teach_tit_6.png" />
      <img class="tea_buy_txt" src="./../../../assets/activity/teacher/teach_buy_txt.png" />

      <div class="btns">
        <div class="joinde" @click.stop="toIndex" v-if="allBuyItem && allBuyItem.isJoined===1">已购买，返回首页到“已加入”中参与学习吧</div>
        <img class="btn" @click.stop="allBuy" src="./../../../assets/activity/teacher/teach_btn.png" v-else />
      </div>


      <!--支付弹窗-->
      <div class="pay_window" v-if="toPay">
        <div class="pay_cont">
          <img class="close" @click.stop="closePya" src="./../../../assets/activity/teacher/clo.png" />
          <img class="code" src="./../../../assets/activity/teacher/code.png" />
          <p>扫描二维码或者搜索zike04，</p>
          <p>添加好友，备注<span>【礼包】</span>领取福利</p>
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
import wxUtil from '@/util/wx/index'
import WechatMixin from '@/mixins/wechat'

import { getBeaconsApi } from '@/api/pages/home'

  @Component({
    name: 'home-index',
    components: {
      Scroller
    },
    mixins: [ListMixin,WechatMixin]
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
        communityId: '15528745be37f7f9b09d8ad4035bb2fa',
        teacherName:'阿珂'
      },
      {
        tit: '小白到表达高手的二十堂课',
        communityId: 'ccc55bf043828408ec461feddb2c7aa5',
        teacherName:'龙兄'
      },
      {
        tit: '职场选择力：如何让每一步抉择都不走弯路',
        communityId: 'ff9732862e074978b71f17301b385103',
        teacherName:'七芊'
      },
      {
        tit: '掌控人生的20堂职场课',
        communityId: '681a5f0ca92e5fe660d0b34429f28315',
        teacherName:''
      },
      {
        tit: 'PPT小白成长训练营',
        communityId: '990bc2d569673aaa1d9642a1c15c6e64',
        teacherName:'三顿'
      },
      {
        tit: '小白如何逆袭成为月入10w的全能写手',
        communityId: '03b9200ec0d02059adc1882956104bc2',
        teacherName: 'aida'
      },
      {
        tit: '公众号裂变涨粉实训营',
        communityId: 'c1cc895532314b39db4863961a5e9a4a',
        teacherName: '书记'
      },
      {
        tit: '用得上的商学课',
        communityId: '9d39fe7163f531fc5670a346715519d9',
        teacherName: '路聘'
      },{
        tit: '月薪5万的人都在学的职场必修课',
        communityId: '38ecff5824a5436f604d4b0362b7c6be',
        teacherName: '月薪5万的人都在学的职场必修课'
      }
    ]

    selectItem = {}
    allBuyItem = {}
    allBuyCommunityId = '38ecff5824a5436f604d4b0362b7c6be' //一件购买id
    statistics = {}
    allBuy () {
      console.log('allBuy')
      this.selectItem = this.allBuyItem
      this.payIn()
    }

    toDetail (index) {
      console.log(this.payListMsg[index-1].communityId)
      this.$router.push(`/introduce/${this.payListMsg[index-1].communityId}`)
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

    closePya(){
      this.toPay = false
      this.allBuyItem.isJoined = 1
      this.$router.push(`/index`)
    }

    toIndex(){
      this.$router.push(`/index`)
    }

    created () {
      console.log('====',this.$route)
      let that = this
      if(this.$route.query){
        this.statistics = this.$route.query
      }
      getCommunityInfoApi({communityId: this.allBuyCommunityId}).then(res=>{
        console.log(res)
        this.allBuyItem = res

        that.wechatShare({
          'titles': '月薪5万的人都在学的职场必修课',
          'title': '月薪5万的人都在学的职场必修课',
          'desc': '如何快速找准自己的职业发展道路？如何提高工作效率告别加班？这一堂，全给你！',
          'imgUrl': 'https://cdnstatic.zike.com/Uploads/static/beacon/lighthouse-logo.png',
          'link': location.origin + `/beaconweb/#/teacherActivity`
        })
      })
    }

    // ------------------------------------------------
    /**
     * 页面入口初始
     */

    async init () {
    }
    // ------------------------------------------------
    async payIn () {

      const params = await payApi({
        productId: this.selectItem.communityId,
        productType: 1,
        userCouponId: 0,
        specialTopic : this.statistics && this.statistics.specialTopic?this.statistics.specialTopic:'',
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
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    .pay_cont {
      width:305px;
      height:305px;
      background:rgba(255,255,255,1);
      border-radius: 5px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .close {
        width: 15px;
        height: 15px;
        display: block;
        position: absolute;
        right: 0;
        top: -50px;
      }
      .code {
        width: 150px;
        height: 150px;
        display: block;
        margin: 0 auto;
        margin-bottom: 15px;
      }
      p {
        font-size: 16px;
        font-family: SourceHanSansCN-Bold;
        font-weight: bold;
        color: rgba(5,0,0,1);
        line-height: 18px;
        text-align: center;
        span {
          color: red;
        }
      }
    }
  }
</style>
