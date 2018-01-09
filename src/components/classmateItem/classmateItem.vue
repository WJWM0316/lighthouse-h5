<template>
  <div class="classmate-item" catchtap="handleOne">
    <div class="userInfo-img">
      <img class="headImg" :src="item.avatarUrl || '../../assets/icon/img_head_default.png'">
      <img class="sex" v-if="item.gender"
             :src="item.gender === 1 ? '../../../assets/icon/icon_boy.png' : '../ ../../assets/icon/icon_girl.png'">
    </div>
    <div class="userInfo-desc">
      <div class="name">{{item.realName}}</div>
      <div class="persion-info">
        {{item.workTimeName}}{{item.workTimeName ? ' | ': ''}}{{item.career}}{{item.career ? ' | ': ''}}{{item.office}}
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton } from 'vux'
  import { testApi } from '@/api/pages/login'
  import ClassmateItem from '@/components/classmateItem/classmateItem'
  @Component({
    name: 'login-index',
    components: {
      XInput,
      XButton,
      ClassmateItem
    },
    props: {
      item: {
        type: Object,
        twoWay: true,
      },
    }
  })
  export default class ApplyIndex extends Vue {
    handleOne (e) { // 点击跳转个人详情
      this.$emit('tap-one', this.item.userId)
    }

    created () {
    }

    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../styles/mixins";
  .classmate-item {
    border-bottom: 1px solid #dcdcdc;
    padding:15px 0;
    margin-left: 15px;
    display: flex;
    align-items: center;
  }
  .userInfo-img {
    position: relative;
    font-size: 0;
    line-height: 1;
    .headImg{
      width: 50px;
      height: 50px;
      background: pink;
      border-radius: 50%;
    }
    & .sex {
      position: absolute;
      width: 18px;
      height: 18px;
      bottom: 0;
      right: 0;
      border-radius: 50%;
    }
  }

  .userInfo-desc {
    margin-left: 15px;

    .name {
      font-size: 15px;
      line-height: 19px;
      .setEllipsis(295px);
    }
    .persion-info{
      padding-top: 5px;
      font-size: 13px;
      line-height: 17px;
      color: #929292;
      .setEllipsis(295px);
    }
  }
</style>
