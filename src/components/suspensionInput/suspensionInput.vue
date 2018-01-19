<template>
  <!-- 悬浮输入框 -->
  <div class="suspension-input" :class="{ 'z-focused': isFocused }" v-if="isShow">
    <div class="ask-box">
      <div class="user-input">
        <input type="text"
               :placeholder="placeholder"
               v-model="suspensionInputContent"
               @blur="hide()"
               @focus="handleFocus"
               ref="suspension-input"
               maxlength="1000"
               autofocus />
      </div>
      <span class="ask-btn" @click="send">{{sendText}}</span>
    </div>
  </div>
</template>

<style lang="less" scoped type="text/less">
  .suspension-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    &.z-focused {
      transform: translateY(-54%);
    }

    .ask-box {
      height: 54px;
      background-color: #f8f8f8;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      & .user-input {
        margin-top: 0;
        width: 315px;
        height: 34px;
        border-radius: 3px;
        background-color: #fff;
        font-size: 14px;
        padding: 0 10px;
        & input {
          line-height: 34px;
          width: 100%;
          height: 100%;
          border-style: none;
          outline: none;
        }
      }

      & .ask-btn {
        flex: 0 0 auto;
        margin-right: -10px;
        padding: 0 10px;
        border-radius: 0;
        font-size: 15px;
        font-weight: 500;
        color: #d7ab70;
      }

    }
  }
</style>

<script>
  import index from './main.js'
  export default index
</script>
