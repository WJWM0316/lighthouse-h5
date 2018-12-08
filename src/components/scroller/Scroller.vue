<template>
  <pull-to
    class="m-scroller"
    ref="pullTo"
    :top-load-method="refreshable ? handleRefresh : undefined"
    :bottom-load-method="pullupable ? handlePullup : undefined"
    :is-top-bounce="refreshable"
    :is-bottom-bounce="pullupable"
    :top-block-height="scroller.topBlockHeight"
    :bottom-block-height="scroller.bottomBlockHeight"
    :top-config="scroller.topConfig"
    :bottom-config="scroller.bottomConfig"
    @scroll="handleScroll"
    @infinite-scroll="handleInfiniteScroll">
    <template slot="top-block" slot-scope="props">
      <div class="top-block">
        <p v-text="props.stateText"></p>
      </div>
    </template>

    <slot></slot>
    <bottom-loading :status="loadingStatus" v-if="showBottomLoading || infiniteScroll" />

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
    },

    // 是否开启无限加载
    infiniteScroll: {
      type: Boolean,
      default: true
    },

    // 开启无限加载的时候是否显示底部loading
    showBottomLoading: {
      type: Boolean,
      default: true
    },

    // 是否没有更多数据加载了
    isNoneData: {
      type: Boolean,
      default: false
    },

    //是否显示地步数据加载提示
    isShowBottom: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    isNoneData: {
      handler (val) {
        if (this.isNoneData) {
          this.scroller.bottomConfig = Object.assign({}, this.scroller.bottomConfig, { doneText: '没有更多内容了~' })
          this.switchLoadingStatus('ended')
        } else {
          this.scroller.bottomConfig = Object.assign({}, this.scroller.bottomConfig, { doneText: '加载完成' })
          this.switchLoadingStatus('done')
        }
      },
      immediate: true
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

  // 底部loading状态
  loadingStatus = 'default'

  /**
   * 切换loading状态
   */
  switchLoadingStatus (status) {
    this.$nextTick(() => {
      switch (status) {
        case 'done':
          this.loadingStatus = 'default'
          break
        // case 'loading':
        //   this.loadingStatus = 'loading'
        //   break
//       case 'ended':
//         this.loadingStatus = 'ended'
//         break
        default:
          this.loadingStatus = status
      }
    })
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
    this.$nextTick(() => {
      this.$emit('pullup', loaded)
    })
  }

  /**
   * 滚动到底部
   */
  handleInfiniteScroll () {
    if (this.infiniteScroll && this.loadingStatus === 'default') {
      this.switchLoadingStatus('loading')
      this.$emit('infinite-scroll', this.switchLoadingStatus)
    }
  }

  /**
   * 滚动监听
   */
  handleScroll (e) {
    e.preventDefault()
    this.$emit('scroll', e)
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

