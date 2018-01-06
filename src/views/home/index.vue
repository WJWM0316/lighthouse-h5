<template>
  <div class="p-body p-home-index">
    <scroller @refresh="handleRefresh" @pullup="handlePullup">
      <div class="banners">
        <swiper class="m-banner-swiper" dots-class="banner-dots" dots-position="center" :show-desc-mask="false" :auto="true" :interval="4000" :aspect-ratio="290 / 345">
          <swiper-item v-for="(item, index) in banners" :key="`banner_${index}`">
            <a href="#" @click.prevent.stop="handleTapBanner(item)"><image-item class="image-item" :src="item.img" mode="horizontal" /></a>
          </swiper-item>
        </swiper>
      </div>
      <div class="communities">
        <h3 class='title'>我开设的灯塔</h3>
        <div class="list">
          <community-card />
        </div>
      </div>
      <div class="communities">
        <h3 class='title'>我加入的灯塔</h3>
        <div class="list">
          <community-card />
        </div>
      </div>
      <div class="communities">
        <h3 class='title'>精选灯塔</h3>
        <div class="list">
          <community-card />
        </div>
      </div>
    </scroller>
    <!-- <bottom-loading :end="pagination.isLastPage" /> -->
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import { Swiper, SwiperItem } from 'vux'
import CommunityCard from '@/components/communityCard'
import Scroller from '@/components/scroller'

import ListMixin from '@/mixins/list'

@Component({
  name: 'home-index',
  components: {
    Swiper,
    SwiperItem,
    CommunityCard,
    Scroller
  },
  mixins: [ListMixin]
})
export default class HomeIndex extends Vue {
  // banner图片列表
  banners = [
    { url: '/message', img: 'https://zike-uploads-pro.oss-cn-shenzhen.aliyuncs.com/Uploads/static/beacon/head-banner.png' },
    { url: '/center', img: 'https://zike-uploads-pro.oss-cn-shenzhen.aliyuncs.com/Uploads/static/beacon/sanyue.jpg' }
  ]

  created () {
    console.log(this)
  }

  handleTapBanner (item) {
    this.$router.push(item.url)
  }

  /**
   * 下拉刷新
   */
  handleRefresh (loaded) {
    setTimeout(() => {
      loaded('done')
    }, 1000)
  }

  /**
   * 上拉加载
   */
  handlePullup (loaded) {
    setTimeout(() => {
      loaded('done')
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-home-index {
  padding-bottom: 50px;

  .banners {
    padding: 10px 15px 0;
    margin-bottom: 43px;
    border-radius: 3px;
    overflow: hidden;

    .m-banner-swiper {
      height: 290px;
      border-radius: 3px;
      overflow: hidden;

      .image-item {
        width: 100%;
        height: 100%;
      }
    }
  }

  .communities {
    padding: 10px 15px 20px;

    & > .title {
      display: block;
      margin-bottom: 10px;
      line-height: 30px;
      font-weight: bold;
      font-size: 20px;
    }

    .community-item:not(:last-child) {
      margin-bottom: 35px;
    }
  }
}
</style>
