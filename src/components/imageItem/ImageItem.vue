<template>
  <i class="u-image" :class="{ [mode]: true, round: round }"><img :src="src"></i>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'image-item',
  props: {
    // 图片源路径
    src: String,
    // 延迟加载
    lazyload: {
      type: Boolean,
      default: false
    },
    // 延迟加载时的初始url
    lazySrc: {
      type: String,
      default: ''
    },
    // 图片铺开模式，auto：完全展示，horizontal：宽度100%高度自适应，vertical：高度100%宽度自适应
    mode: {
      type: String,
      default: 'auto'
    },
    // 是否圆形
    round: {
      type: Boolean,
      default: false
    }
  }
})
export default class Image extends Vue {}
</script>

<style lang="less" scoped type="text/less">
// @import "../../styles/variables";
// @import "../../styles/mixins";

.u-image {
  display: inline-block;
  font-size: 0;
  line-height: 1;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;

  &.round {
    border-radius: 50%;
  }

  &.horizontal > img {
    max-width: 100%;
    height: auto;
  }

  &.vertical > img {
    width: auto;
    max-height: 100%;
  }

  &.auto > img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
