<template>
  <!-- 朋友圈动态列表项 -->
  <div class="hintMsg" v-if="isHintShow">
    <div class="hint">
      <p class="hint_title" v-if="msg&&msg.title">{{msg.title}}</p>
      <div class="content" v-if="msg&&msg.content">
        <div class="cont_blo" v-for="item,index in msg.content">{{item}}</div>
      </div>
      <div class="btn double" v-if="type==2">
        <div class="blo_btn cancel" @click.prevent.stop="cloHint">{{msg.cancelText}}</div>
        <div class="blo_btn singel" @click.prevent.stop="hintSucFuc">{{msg.buttonText}}</div>
      </div>
      <template v-else>
        <div class="btn singel" @click.prevent.stop="cloHint" v-if="msg&&msg.buttonText">{{msg.buttonText}}</div>
      </template>
    </div>
  </div>
</template>

<style lang="less">
  .hintMsg {
    position: fixed;
    background:rgba(0,0,0,0.5);
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .hint {
    width:280px;
    background:rgba(255,255,255,1);
    border-radius:8px;
    padding: 0 25px;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    margin-left: -140px;
    top: 20%;
    border: 1px solid #cccccc;
    .hint_title {
      margin: 33px 0 14px 0;
      text-align: center;
      font-size: 17px;
      font-family:PingFangSC-Medium;
      color:rgba(53,64,72,1);
    }
    .content {
      .cont_blo {
        font-size: 16px;
        font-family:PingFangSC-Light;
        color:rgba(53,64,72,1);
        line-height: 20px;
        text-align: left
      }
    }
    .btn {
      margin-top: 20px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 17px;
      &.double {
        display: flex;
        flex-direction: row;

      }
      .singel {
        font-family:PingFangSC-Regular;
        color:rgba(215,171,112,1);
      }
      .cancel {
        color:rgba(188,188,188,1);
      }
      .blo_btn {
        flex: 1;
      }
    }
  }
</style>

<script>
  import index from './main.js'
  export default index
</script>
