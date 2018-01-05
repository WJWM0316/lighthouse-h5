<template>
  <div class="p-body p-home-index">
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite">
      <div class="banners">
        <swiper class="m-banner-swiper" dots-class="banner-dots" dots-position="center" :show-desc-mask="false" :auto="true" :interval="4000" :aspect-ratio="290 / 345">
          <swiper-item v-for="(item, index) in banners" :key="`banner_${index}`">
            <a href="#" @click.prevent.stop="handleTapBanner(item)"><image-item :src="item.img" mode="horizontal" /></a>
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

import ListMixin from '@/mixins/list'

@Component({
  name: 'home-index',
  components: {
    Swiper,
    SwiperItem,
    CommunityCard
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
  }

  handleTapBanner (item) {
    this.$router.push(item.url)
  }

  refresh () {
    console.log('refresh')
  }

  infinite () {
    console.log('infinite')
  }
}
</script>

<style lang="less" scoped>
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
