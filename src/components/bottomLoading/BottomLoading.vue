<template>
  <div class='u-bottom-loading'>
    <p class="text" v-if="status === 'default'">上拉至底部加载更多</p>
    <image-item class='icon' :src="loadingSrc" v-else-if="status === 'loading'" />
    <p class='text' v-else>没有更多内容了～</p>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'bottom-loading',
  props: {
    status: {
      type: String,
      default: 'default'
    }
  }
})
export default class BottomLoading extends Vue {
  loadingSrc = require('@/assets/icon/icon_loading.gif')
}
</script>

<style lang="less" scoped>
.u-bottom-loading {
  padding: 15px;
  text-align: center;

  .icon {
    width: 55px;
    height: 18px;
  }

  .text {
    display: inline-block;
    line-height: 18px;
    font-size: 13px;
    color: #bcbcbc;
  }
}
</style>

