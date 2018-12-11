<template>
  <!--训练营客服弹窗-->
  <div class="trainingCampAlert" v-if="trainingCampAlert" @click.stop="close">
    <div class="content" v-if="pageInfo.alterWechatQrcode" @click.stop="">
      <img class="closeBtn" src="../../assets/icon/icon-close.png" alt="" @click.stop="close" />
      <h3 v-if="isKefu">联系客服</h3>
      <h3 v-if="!isKefu">恭喜你加入训练营</h3>
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
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  @Component({
    props: {
      pageInfo: {
        type: Object
      },
      trainingCampAlert: {
        type: Boolean,
        default:false
      },
      isKefu: {
        type: Boolean,
        default: false
      }
    }
  })
  export default class popups extends Vue {
    /* 复制 */
    copy () {
      //要复制文字的节点
      let text = this.pageInfo.consultantCustomerWechat
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value', text)
      document.body.appendChild(input) 
      //区分iPhone设备
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        window.getSelection().removeAllRanges();//这段代码必须放在前面否则无效
        let range = document.createRange()
        // 选中需要复制的节点
        range.selectNode(input)
        // 执行选中元素
        window.getSelection().addRange(range)
        // 执行 copy 操作
        let successful = document.execCommand('copy')
        // 移除选中的元素
        window.getSelection().removeAllRanges()
      }else{
        input.select() // 选择对象
        document.execCommand("Copy") // 执行浏览器复制命令
      }
      document.body.removeChild(input)
      this.$vux.toast.text('复制成功', 'bottom')
      this.$emit('close')
    }
    close () {
      this.$emit('close')
    }
  }
</script>

<style lang="less" scoped="scoped">
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
        text-align: center;
        padding: 0 25px;
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
</style>