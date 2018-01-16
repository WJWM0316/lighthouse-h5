<template>
  <div class="m-wechat-code-modal" v-show="show">
    <div class="wrapper">
      <div class="dialog">
        <div class="bd">
          <image-item class="image" :src="codeUrl" mode="horizontal"></image-item>
          <p class="text" v-text="content"></p>
        </div>
        <footer class="ft">
          <button type="button" class="cancel u-btn" @click="handleCancel">取消</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'wechat-code-modal',
  model: {
    prop: 'show',
    event: 'input'
  },
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: false
    },

    // 小程序码图片url
    codeUrl: {
      type: String,
      default: require('@/assets/icon/img_wechat_code.png')
    },

    // 文字内容提示
    content: {
      type: String,
      default: '抱歉，由于微信的功能限制，请您长按识别小程序码，到小程序中录制或发布视频。'
    }
  }
})
export default class WechatCodeModal extends Vue {
  /**
   * 点击取消
   */
  handleCancel () {
    this.$emit('cancel')
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.m-wechat-code-modal {
  .setModal();

  .dialog {
    background: #fff;
    border-radius: 12px 12px 0 0;
    font-size: 16px;
    color: #666;
  }

  .bd {
    padding: 40px 62px;
    text-align: center;

    .image {
      width: 160px;
      height: 160px;
      margin-bottom: 15px;
    }
  }

  .ft {
    padding: 23px 62px;
    border-top: solid 1px #dcdcdc; /* no */
    text-align: center;

    .cancel {
      padding: 11px 22px 9px;
      background: #f8f8f8;
      width: 100%;
      line-height: 24px;
      border-radius: 22px;
      font-size: 16px;
      color: #929292;

      &:active {
        background: #e9e9e9;
      }
    }
  }
}
</style>

