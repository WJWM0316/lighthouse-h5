<template>
  <div v-transfer-dom class="share-dialog" @touchmove.prevent>
    <x-dialog v-model="isShow" class="dialog-main" @click.native="closeDialog">
      <i class="u-icon-arrow tip-arrow"></i>
      <div class="tip-text" v-html="invitWx"></div>
      <img :src="borwserInfo.ios ? wechatShareIos : wechatShareAndroid" alt="" class="share-img">
      <div class="i-know-btn" >我知道了</div>
    </x-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import BorwserInfo from '@/util/browser/index'
  import { XDialog, TransferDomDirective as TransferDom } from 'vux'

  @Component({
    name: 'share-dialog',
    components: { XDialog },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      shareType: {
        type: Number,
        default: 1 // 1：普通分享 2.邀请好友
      }
    },
    directives: {
      TransferDom
    }
  })
  export default class UploadHeadImg extends Vue {
    invitWx = '点击右上角分享，<br>邀请好友加入小灯塔'
    wechatShareAndroid = require('@/assets/share/wechat_share_android.png')
    wechatShareIos = require('@/assets/share/wechat_share_ios.png')
    borwserInfo = {}
    created () {
      this.borwserInfo = BorwserInfo.getVersion()
    }
    closeDialog () {
      this.$emit('close-share')
    }
  }
</script>

<style lang="less" type="text/less">
  .share-dialog{
    .dialog-main{
      .weui-mask{
        background: rgba(255,255,255,0.90);
      }
      .weui-dialog{
        background: transparent;
        width: 100%;
        height: 100%;
        max-width: 100%;
      }
      .u-icon-arrow{
        background-image: url("../../assets/icon/icon-arrow.png");
        width: 17px;
        height: 23px;
      }
      .tip-arrow{
        position: fixed;
        top: 12px;
        right: 16px;
      }
      .tip-text{
        width: 300px;
        max-width: 300px;
        position: fixed;
        top: 16%;
        font-size: 23px;
        color: #354048;
        left: 50%;
        margin-left: -150px;
      }
      .share-img{
        width: 139px;
        height: 139px;
        position: fixed;
        top: 30%;
        left: 50%;
        margin-left: -69px;
      }
      .i-know-btn{
        width: 120px;
        height: 44px;
        border-radius: 22px;
        background-color: #ffe266;
        line-height: 44px;
        position: fixed;
        font-size: 16px;
        top: 70%;
        left: 50%;
        margin-left: -60px;
      }
    }
  }
</style>
