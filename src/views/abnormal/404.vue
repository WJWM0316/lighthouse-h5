<template>
  <div class="not-found">
    <div class="bg-img">
      <img src="./../../assets/page/404@3x.png" alt="">
      <p class="fs15">页面走丢了，等一下再试试吧</p>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component()
  export default class notFound extends Vue {
  }
</script>
<style lang="less">
  .not-found{
    width: 100%;
    height: 100%;
    display: flex;
    .bg-img{
      font-size: 0;
      width: 55%;
      margin: auto;
      text-align: center;
      color: #929292;
      & > p{
        margin-top: 30px;
      }
    }
  }
</style>
