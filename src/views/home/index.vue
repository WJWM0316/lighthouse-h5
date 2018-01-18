<template>
  <div class="p-body p-home-index">
    <scroller @refresh="handleRefresh" @pullup="handlePullup" :is-none-data="pagination.end">
      <div class="banners">
        <swiper class="m-banner-swiper" dots-class="banner-dots" dots-position="center" :show-desc-mask="false" :auto="true" :interval="5000" :aspect-ratio="290 / 345">
          <swiper-item v-for="(item, index) in banners" :key="`banner_${index}`">
            <a href="#" @click.prevent.stop="handleTapBanner(item)"><image-item class="image-item" :src="item.img" mode="horizontal" /></a>
          </swiper-item>
        </swiper>
      </div>
      <div class="communities" v-if="creations && creations.length > 0">
        <h3 class='title'>我开设的灯塔</h3>
        <div class="list">
          <community-card class="community-item" v-for="item in creations" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
        </div>
      </div>
      <div class="communities" v-if="joins && joins.length > 0">
        <h3 class='title'>我加入的灯塔</h3>
        <div class="list">
          <community-card class="community-item" v-for="item in joins" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
        </div>
      </div>
      <div class="communities" v-if="communities && communities.length > 0">
        <h3 class='title'>精选灯塔</h3>
        <div class="list">
          <community-card class="community-item" v-for="item in communities" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
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

import { getBeaconsApi } from '@/api/pages/home'

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
    { url: '/center/help', img: 'https://cdnstatic.zike.com/Uploads/static/beacon/head-banner.png' },
    { url: '/center/help', img: 'https://cdnstatic.zike.com/Uploads/static/beacon/sanyue.jpg' },
    { url: '/center/help', img: 'https://cdnstatic.zike.com/Uploads/static/beacon/head-banner-3.jpg' }
  ]

  // 我创建的社区
  creations = []
  // 我加入的社区
  joins = []
  // 社区列表
  communities = []
  ready = false

  created () {
    this.init().then(() => {})
  }

  /**
   * 页面初始化
   */
  async init () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    await this.getList({ page: 1 })
    await this.getBanners()
    this.ready = true
  }

  /**
   * 获取banner列表
   */
  getBanners () {}

  /**
   * 加载下一页
   */
  loadNext() {
    const nextPage = this.pagination.page + 1
    this.getList({ page: nextPage })
  }

  /**
   * 获取列表
   */
  async getList ({ page, pageSize } = {}) {
    try {
      if (this.pagination.end || this.pagination.busy) {
        // 防止多次加载
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      const params = {
        page: page,
        pageCount: pageSize,
        globalLoading: !this.ready
      }

      this.pagination.busy = true
      const { creations, joins, list, total } = await getBeaconsApi(params)
      this.creations = page === 1 ? creations : this.creations.concat(creations || [])
      this.joins = page === 1 ? joins : this.joins.concat(joins || [])
      this.communities = page === 1 ? list : this.communities.concat(list || [])

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = total
      this.pagination.end = this.isLastPage
      this.pagination.busy = false
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 下拉刷新
   */
  handleRefresh (loaded) {
    setTimeout(() => {
      this.init()
      loaded('done')
    }, 500)
  }

  /**
   * 上拉加载
   */
  handlePullup (loaded) {
    setTimeout(() => {
      this.loadNext()
      loaded('done')
    }, 500)
  }

  /**
   * 点击banner
   */
  handleTapBanner () {
    location.href = 'https://stg.ziwork.com/zikeappstatic/lighthousestatic/howplay/index.html'
  }

  /**
   * 点击卡片
   */
  handleTapCard (item) {
    if (item.isAuthor === 1 || item.isJoined === 1) { // 如果已经加入并且已入社跳转到入社后页面
      this.$router.push(`/introduce/${item.communityId}/community`)
    } else { // 未入社跳到未入社页面
      this.$router.push(`/introduce/${item.communityId}`)
    }
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
