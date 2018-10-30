<template>
  <div class="CouponResult">
    <div class="contentBox">
      <div class="title">成功领取</div>
      <div class="amountBox">
        <div class="amount"><span>￥</span>{{amount}}</div>
        <div class="description">优惠券金额</div>
      </div>
      <div class="txt">
      	点击下方按钮 前往小灯塔App使用吧～
      </div>
      <div class="btn" @click.stop="toApp">立即使用</div>
      <div class="bg">
        <img src="../../../assets/icon/appcouponbg.png" />
      </div>
    </div>
    <div class="bottom">- 小灯塔·职场学习社区 -</div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'appCouponResult',
    data () {
      return {
        amount: 99.99
      }
    },
    methods: {
      toApp () {
//      let userAgent = navigator.userAgent.toLowerCase(), //获取userAgent
//      isInapp = userAgent.indexOf("sunyuki")>=0;
//      if (isInapp) {
//        let str = JSON.stringify({type:102,extraParams:{communityId:'f66d1a5c49e578085f976097e0bdb2f6'}})
//        WebViewJavascriptBridge.callHandler('send',str,function(response) {
//          alert(response);
//          document.getElementById("returnValue").value = response;
//        });
//      }
        
          let userAgent = navigator.userAgent.toLowerCase(), //获取userAgent
          isInapp = userAgent.indexOf("TTBeacon")>=0;
          if (isInapp) {
            let res = JSON.stringify({type:118})
            this.send(res)
          }else{
            alert(11111111)
            console.log(navigator.userAgent.match(/android/i), navigator.userAgent, 111, navigator.userAgent.match(/(iPhone|iPod|iPad)/i))
            let appUrl = "ttbeacon://app:8080/launcher?t=3"
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
        
      }
    },
    created () {
      this.amount = this.$route.query.amount
    }
  }
</script>

<style lang="less" scoped="scoped">
  .CouponResult{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: #FFEB4F;
    padding-top: 30px;
    padding-left: 20px;
    position: relative;
    .contentBox{
      text-align: center;
      padding-top: 34px;
      position: relative;
      background: #FFFFFF;
      width: 335px;
      height: 495px;
      border-radius: 10px;
      .title{
        display: inline-block;
        position: relative;
        text-align: center;
        color: #E7AB29;
        font-size: 30px;
        font-weight: 600;
        &::before{
          position: absolute;
          top: 21px;
          left: -19px;
          content: "";
          display: block;
          width: 12px;
          height: 3px;
          background: #E7AB29;
        }
        &::after{
          position: absolute;
          top: 21px;
          right: -19px;
          content: "";
          display: block;
          width: 12px;
          height: 3px;
          background: #E7AB29;
        }
      }
      .amountBox{
        display: inline-block;
        margin-top: 14px;
        width: 240px;
        height: 90px;
        text-align: center;
        background-color: #F8F8F8;
        .amount{
          line-height: 36px;
          margin-top: 18px;
          color: #354048;
          font-size: 36px;
          font-weight: 500;
          span{
            font-size: 17.5px;
          }
        }
      }
      .description{
        text-align: center;
        font-size: 12px;
        color: #929292;
      }
      .txt{
        font-size: 15px;
        color: #354048;
        margin-top: 33.5px;
        display: inline-block;
        width: 162px;
        height: 42px;
        line-height: 21px;
      }
      .btn{
        display: inline-block;
        line-height: 49px;
        margin-top: 20px;
        border-radius: 50px;
        color: #FFFFFF;
        width: 270px;
        height: 49px;
        background-color: #FA6A30;
        position: relative;
        z-index: 1;
      }
      .bg{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 0;
        img{
          width: 100%;
        }
      }
    }
    .bottom{
      font-size: 12px;
      color: #A37A43;
      font-weight: 300;
      text-align: center;
      margin-top: 20px;
    }
  }
</style>