<template>
  <div class="receive-coupons">
    <div class="headPhoto">
      <img :src="item.imgUrl" alt="" />
    </div>
    <div class="content isReceive">
      <div class="top">
        <div class="left">
          <span>{{item.discount}}</span>
          <p>优惠金额</p>
        </div>
        <div class="right">
          <span v-if="item.relationCommunity">
            仅可购买《{{item.relationCommunity.title}}》
          </span>
          <span v-else-if="!item.relationCommunity && item.demand!==0">适用于小灯塔内满{{item.demand}}元的灯塔均可使用</span>
          <span v-else>小灯塔内所有灯塔均可使用</span>
          <span>
            有效期：{{item.useStartTime*1000 | date('YYYY.M.D')}}-{{item.useEndTime*1000 | date('YYYY.M.D')}}
          </span>
        </div>
      </div>
      <div class="line"></div>
      <div class="bottom">
        <input  v-if="!isLogin" class="inpPhone" maxlength="11" type="number" placeholder="请输入手机号码" v-model="info.mobile"/>
        <div class="section" style="position: relative" v-if="this.isSendMessage">
          <x-input placeholder="短信验证码"
                   v-model="info.sms"
                   :show-clear="showClear"
                   type="tel"
                   :max="6"
                   class="login-input">
            <span slot="right" class="send-code">
              <time-btn ref="timerBtn"
                :login-info="info"
                @send="onSend"
                :second="60"
                class="login-code-timer"
                :type="sendSmsType"
                :isAppCoupon="true"></time-btn>
            </span>
          </x-input>
        </div>
        <div class="receive" v-if="!isLogin" @click.stop="receive">免费领取优惠券</div>
        <div class="unReceive" v-else>
          <span class="littleTitle" v-show="isReceive === 2">你已经领取过该优惠券啦，快去使用吧！</span>
          <span class="littleTitle" v-show="isReceive === 4">来晚啦～优惠券已经被领完了！</span>
          <span class="littleTitle" v-show="isReceive === 3">来晚啦～优惠券已经过期！</span>
          <div v-if="isReceive === 2" @click.stop="toUse">
            立即使用
          </div>
          <div v-else @click.stop="toLate">
            查看更多职场福利
          </div>
        </div>
        <div class="rule">
          <span></span>
          活动规则
          <span></span>
        </div>
        <div class="rule-content">
          <span>1. 优惠券新老用户同享，领完即止;</span>
          <span>2. 优惠券仅限在线支付使用，且不可与其他优惠叠加使用;</span>
          <span>3. 其他未尽事宜，请咨询客服，客服微信号zike03;</span>
          <span>4. 本优惠券最终解释权归小灯塔官方所有。</span>
          <span>5.当手机号未有对应账户时，将会用此手机号自动创建账户。</span>
        </div>
      </div>
    </div>
    <!--底部-->
    <div class="footer">
      - 小灯塔·职场分享平台 -
    </div>
    <div class="mask" v-if="needImgCode">
      <div class="codeImgBox">
        <div class="title">重新获取短信验证码</div>
        <x-input 
          v-model="info.verifyCode"
          placeholder="请输入右侧验证码"
          :show-clear="showClear"
          :max="6"
          class="codeImg">
          <span slot="right" class="send-code">
            <img :src="codeImgUrl" alt="" />
          </span>
        </x-input>
        <div class="codeImgBtn" @click.stop="sendCodeImg">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { XInput } from 'vux'
import TimeBtn from '@/components/pageCommon/timerBtn/TimeBtn.vue'
import wxUtil from '@/util/wx/index'
import WechatMixin from '@/mixins/wechat'
import { appCouponReceiveApi,couponAppApi } from '@/api/pages/pageInfo'
import { loginApi, getAppCodeImg } from '@/api/pages/login'
  export default {
    components: {
      XInput,
      TimeBtn
    },
    mixins: [WechatMixin],
    data(){
      return {
        item:{
          couponId:'',    //优惠券的id
          title:'',
          discount:'',    //优惠券的金额
          imgUrl:"",
          relationCommunity:{
            title:'',
          },
          status:'',    //是否为可领取状态：1.正常;2.不可领取;3.不可使用
          useEndTime:'',    //优惠券结束时间
          useStartTime:'',    //优惠券开始时间
          realUrl: 'https://www.ziwork.com/beaconweb/'
        },
        isReceive:'',   //是否领取
        status:'',      //路劲带过来的id
        prama: '',  // 要带的参数
        showClear: false, // 输入框是否显示清空的按钮
        sendSmsType: 16, // 6.小程序登录,9微信浏览器小灯塔登录
        info: {
          mobile: '',
          sms: '',
          verifyCode: '',
          from: '16', // 1 注册 2 登录
          coupon_id_code: "",
          app: 1
        },
        phoneNum: '', // 手机号码
        isSendMessage: false,
        needImgCode: false, // 是否展示输入验证码
        codeImgUrl: '', // 验证码图片路径
        isLogin: false // 是否输入手机号码
      }
    },
    methods: {
      //免费领取
      receive(){
        console.log(this.isSendMessage)
        if (this.isSendMessage) {
          appCouponReceiveApi(this.info).then(res => {
            this.isSendMessage = false
            this.isLogin = true
            if (res.status === 1) {
              this.$router.push({path: "/appCouponResult",query: {amount: this.item.discount}})
            } else {
              this.isReceive = res.status
            }
          }).catch(res => {
            console.log(res, 1111111)
          })
          return
        }
        this.isSendMessage = true
        let that = this
        Vue.$vux.loading.show({
          text: '加载中...'
        })
        setTimeout(function(){
          that.$refs['timerBtn'].runs()
        },500)
      },
      //已经领取，去使用
      toUse(){
        
        let userAgent = navigator.userAgent.toLowerCase(), //获取userAgent
        isInapp = userAgent.indexOf("TTBeacon")>=0;
        if (isInapp) {
          let res = JSON.stringify({type:118})
          this.send(res)
        }else{
          alert(1111111111)
          console.log(navigator.userAgent.match(/android/i), navigator.userAgent, 111, navigator.userAgent.match(/(iPhone|iPod|iPad)/i))
          let appUrl = " ttbeacon://app:8080/launcher?t=3\ "
          if(navigator.userAgent.match(/(iPhone|iPod|iPad)/i)){
            alert("ios")
            window.location.href = appUrl
            let iframe = document.createElement('iframe');
            let body = document.body;
            iframe.style.cssText='display:none;width=0;height=0'
            body.appendChild(iframe);
            iframe.src = appUrl;
            setTimeout(function() {
              window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.thetiger.beacon.android";
            }, 2000)
          }
          if(navigator.userAgent.match(/android/i)){
            alert("安卓")
            let iframe = document.createElement('iframe');
            let body = document.body;
            iframe.style.cssText='display:none;width=0;height=0'
            body.appendChild(iframe);
            iframe.src = appUrl;
            window.location.href = appUrl
            setTimeout(function() {
              window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.thetiger.beacon.android";//android 下载地址
            }, 2000) 
          }
        }
        
      },
      //领取完了
      toLate(){
        
      },
      onSend (imgcodeUrl) { // 显示图片验证码
        this.needImgCode = true
        this.refreshCode()
      },
      async refreshCode () {
        try {
          const resp = await getAppCodeImg()
          if (resp.imgcodeUrl) {
            this.codeImgUrl = resp.imgcodeUrl
            this.needImgCode = true
          }
        } catch (e) {
          this.$text(e.message, 'bottom')
        }
      },
      sendCodeImg () {
        this.$refs['timerBtn'].runs()
        let that = this
        that.needImgCode = false
      },
      // 跳转app
      send (str) {
        window.WebViewJavascriptBridge.send(str);
      }
    },
    created(){
//      console.log(window.location)
      //获取优惠券id
      let pattern = /([^?]+)$/ig;
      let str = window.location.hash;
      let status = str.match(pattern);
      console.log(status,"...............")
      this.status = status[0];
      this.info.coupon_id_code = status[0]
      if (this.status === 'a2a') {
        this.prama = '&isNeed'
      } else if (this.status === 'oXG') {
        this.prama = '&isBoss'
      }
      
      couponAppApi(this.status).then((res)=>{
        //已授权请求成功
        this.item=res.coupon;
        this.isReceive = res.isReceive;
        console.log(res,"返回的信息。。。。。。")
      })
      
      document.querySelector('title').innerHTML = "小灯塔"
      
    },
    mounted(){
      
    }
  }
</script>

<style lang="less" scoped>
  .receive-coupons{
    background-color: #FFE266;
    .headPhoto{
      height: 280px;
      width: 100%;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content{
      position: relative;
      margin-top: -60px;
      margin-left: auto;
      margin-right: auto;
      /*z-index: 999;*/
      width: 345px;
      /*height: 428px;*/
      background-color: #FFFFFF;
      border-radius: 10px;
      
      .top{
        width: 100%;
        /*height: 118px;*/
        box-sizing: border-box;
        /*background-color: #FFFFFF;*/
        padding: 28px 0;
        display: flex;
        .left{
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          /*width: 130px;*/
          /*max-width: 140px;*/
          border-right: 0.5px solid #EEEEEE;
          padding-left: 17px;
          padding-right: 10px;
          span{
            /*&:nth-child(1){
              font-size: 12px;
              color: #FA6A30;
              line-height: 20px;
            }*/
            &:nth-child(1){
              text-align: center;
              font-size: 36px;
              font-weight: 600;
              color: #FA6A30;
              line-height: 36px;
              position: relative;
              margin-left: 14px;
              &::before{
                content: '￥';
                color: #FA6A30;
                font-size: 12px;
                position: absolute;
                bottom: -8px;
                left: -14px;
              }
            }
          }
          p{
            font-size: 12px;
            font-weight: 300;
            /*line-height: 12px;*/
            color: #666666;
            text-align: center;
            white-space: nowrap;
          }
        }
        .right{
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          align-content: center;
          justify-content: center;
          padding-left: 13px;
          padding-right: 20px;
          span{
            display: block;
            width: 100%;
            &:nth-child(1){
              font-size:15px;
              line-height: 20px;
              color:#354048;
              overflow: hidden;
              display: -webkit-inline-box;
              text-overflow: ellipsis;
              -webkit-line-clamp:2;
              -webkit-box-orient: vertical;
            }
            &:nth-child(2){
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 13px;
              color: #929292;
              margin-top: 9px;
              line-height: 20px;
            }
          }
        }
      }
      /*分界线*/
      .line{
        position: relative;
        border-bottom: 3px dotted #FFE266;
        &::before{
          content: '';
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background-color: #FFE266;
          position: absolute;
          left: 0;
          transform: translateX(-50%) translateY(-50%);
        }
        &::after{
          content: '';
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background-color: #FFE266;
          position: absolute;
          right: 0;
          transform: translateX(50%) translateY(-50%);
        }
      }
      /*优惠券下半部分*/
      .bottom{
        /*领取按钮*/
        .receive,
        .inpPhone,
        .verificationCode,
        .unReceive>div{
          width: 285px;
          height: 49px;
          border-radius: 24.5px;
          background-color: #FA6A30;
          color: #FFFFFF;
          margin: 25px auto 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .inpPhone::-webkit-input-placeholder{
          color: #929292;
        }
        .verificationCode::-webkit-input-placeholder{
          color: #929292;
        }
        .inpPhone,
        .verificationCode{
          color: #354048;
          background: #FFFFFF;
          outline: none;
          border: 1px solid #E7E7E7;
          padding: 0 25px;
          box-sizing: border-box;
          margin-bottom: 20px;
        }
        .unReceive{
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin: 20px 18px 28px;
          padding: 20px 12.5px;
          background-color: #FFFDF3;
          >.littleTitle{
            text-align: center;
            line-height:20px;
            padding-bottom: 12px;
            font-size: 14px;
            color:rgba(53,64,72,1);
            display: block;
            min-width: 252px;
          }
        }
        .unReceive>div{
          min-width: 285px;
          margin: 0;
          background-color:#FFE266;
          color: #354048;
        }
        /*底部规则*/
        .rule{
          display: flex;
          justify-content: center;
          align-items: center;
          color: #666666;
          font-size: 15px;
          margin-bottom: 15px;
          span{
            width:89px;
            margin: 0 19px;
            border-bottom: 1px solid #EDEDED;
            position:relative; 
            &:nth-child(1)::after{
              position: absolute;
              right: -4px;
              content: '';
              display: block;
              width:6px;
              height: 6px;
              background-color: #EDEDED;
              transform: rotate(45deg) translateY(-50%);
            }
            &:nth-child(2)::before{
              position: absolute;
              left: -9px;
              content: '';
              display: block;
              width:6px;
              height: 6px;
              background-color: #EDEDED;
              transform: rotate(45deg) translateY(-50%);
            }
          }
        }
        /*规则内容*/
        .rule-content{
          padding-bottom: 27px;
          span{
            display: block;
            width: 291px;
            margin: 0 auto;
            margin-bottom: 10px;
            color: #929292;
            font-size: 13px;
            line-height: 15px;
          }
        }
        /*验证码*/
        .section {
          width: 285px;
          height: 49px;
          background-color: #FFFFFF;
          margin: 25px auto 20px;
          .login-input{
            padding-left: 25px;
            padding-right: 25px;
            border: 1px solid #E7E7E7;
            border-radius: 24.5px;
            color: #354048;
            .weui-input::-webkit-input-placeholder{
              color: #929292;
            }
          }
        }
      }
    }
    .isReceive{
      /*height: 429px !important;*/
    }
    
    /*底部文案*/
    .footer{
      display: flex;
      align-items: center;
      justify-content: center;
      color: #A37A43;
      font-size: 12px;
      width: 100%;
      height: 48px;
    }
    /*验证码*/
    .mask{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:rgba(0,0,0,0.5);
      .codeImgBox{
        box-sizing: border-box;
        padding: 40px 15px 30px;
        position: absolute;
        top: 50%;
        left: 50%;;
        transform: translateX(-50%) translateY(-50%);
        width: 305px;
        height: 242px;
        background: #FFFFFF;
        border-radius:8px;
        .title{
          text-align: center;
          font-weight: 500;
          font-size: 18px;
          color: #354048;
        }
        .codeImg{
          margin-top: 26px;
          padding-left: 0;
          padding-right: 0;
          margin-left: 10px;
          margin-right: 10px;
          border-bottom: 1px solid #DCDCDC;
          .send-code{
            img{
              width: 90px;
              height: 30px;
            }
          }
          &::before{
            border: none;
          }
        }
        .codeImgBtn{
          text-align: center;
          line-height: 44px;
          background: #FFE266;
          width: 100%;
          height: 44px;
          border-radius: 30px;
          color: #354048;
          font-weight: 500;
          font-size: 16px;
          margin-top: 25px;
        }
      }
    }
  }
</style>