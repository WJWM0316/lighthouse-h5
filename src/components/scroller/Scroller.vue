<template>
  <pull-to
    class="m-scroller"
    :top-load-method="refreshable ? handleRefresh : undefined"
    :bottom-load-method="pullupable ? handlePullup : undefined"
    :top-block-height="scroller.topBlockHeight"
    :bottom-block-height="scroller.bottomBlockHeight"
    :top-config="scroller.topConfig"
    :bottom-config="scroller.bottomConfig">
    <template slot="top-block" slot-scope="props">
      <div class="top-block">
        <p v-text="props.stateText"></p>
      </div>
    </template>

    <slot></slot>

    <template slot="bottom-block" slot-scope="props">
      <div class="bottom-block">
        <p v-text="props.stateText"></p>
      </div>
    </template>
  </pull-to>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import PullTo from 'vue-pull-to'

@Component({
  name: 'scroller',
  components: {
    PullTo
  },
  props: {
    // 是否开启下拉刷新
    refreshable: {
      type: Boolean,
      default: true
    },

    // 是否开启上拉加载
    pullupable: {
      type: Boolean,
      default: true
    }
  }
})
export default class Scroller extends Vue {
  scroller = {
    topBlockHeight: 30 * window.dpr,
    bottomBlockHeight: 30 * window.dpr,
    topConfig: {
      stayDistance: 30 * window.dpr,
      triggerDistance: 40 * window.dpr
    },
    bottomConfig: {
      stayDistance: 30 * window.dpr,
      triggerDistance: 40 * window.dpr
    }
  }

  /**
   * 下拉刷新
   */
  handleRefresh (loaded) {
    this.$emit('refresh', loaded)
  }

  /**
   * 上拉加载更多
   */
  handlePullup (loaded) {
    this.$emit('pullup', loaded)
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.m-scroller {
  .top-block,
  .bottom-block {
    .setFlex();
    height: 30px; /* px */
    line-height: 30px; /* px */
    align-content: center;
    justify-content: center;
    text-align: center;
    font-size: 14px; /* px */
  }
}
</style>
