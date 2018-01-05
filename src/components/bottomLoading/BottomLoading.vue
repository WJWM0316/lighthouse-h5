<template>
  <div class='u-bottom-loading'>
    <image-item class='icon' :src="loadingSrc" v-if="!end" />
    <p class='text' v-else>没有更多内容了～</p>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'bottom-loading',
  props: {
    // 是否加载完了
    end: {
      type: Boolean,
      default: false
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

