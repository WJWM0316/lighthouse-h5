<template>
  <div class="p-body p-home-index" :class="navTabName">
    <div class="fixed">
      <!-- tab -->
      <div class="nav-bar fs30" :class="navTabName">
        <span @click="toggle('joined')">已加入</span>
        <span @click="toggle('find')">发现</span>
        <span @click="toggle('picked')">精选</span>
      </div>

      <!-- 分类 -->
      <div class="classification fs28" v-if="navTabName === 'picked'">
        <span class="selected">全部</span>
        <span>产品</span>
        <span>产品设计</span>
        <span>技术</span>
        <span>创投</span>
        <span>市场</span>
        <span>运营</span>
      </div>
    </div>

    <scroller @refresh="handleRefresh" @pullup="handlePullup" :is-none-data="pagination.end">

      <!-- 已加入 -->
      <div v-if="navTabName === 'joined'">

        <div class="communities" v-if="joins && joins.length > 0">
          <div class="list">
            <community-info-card class="community-item" v-for="item in joins" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
          </div>
        </div>
        <div v-else>
          <div class="community-empty"></div>
          <p class="community-empty-desc fs26">你还没加入任何灯塔，赶紧来加入吧～</p>
        </div>

        <div class="find-more-box">
          <span class="find-more">发现更多灯塔</span>
          <p class="community-created">
            <span class="fs26">我也要创建灯塔</span>
          </p>
        </div>

      </div>

      <!-- 发现 -->
      <div v-if="navTabName === 'find'">

      </div>

      <!-- 精选 -->
      <div v-if="navTabName === 'picked'">

        <div class="banners">
          <swiper class="m-banner-swiper" dots-class="banner-dots" dots-position="center" :show-desc-mask="false" :auto="true" :interval="5000" :aspect-ratio="290 / 345">
            <swiper-item v-for="(item, index) in banners" :key="`banner_${index}`">
              <a href="#" @click.prevent.stop="handleTapBanner(item)"><image-item class="image-item" :src="item.img" mode="horizontal" /></a>
            </swiper-item>
          </swiper>
        </div>
        <div class="communities" v-if="communities && communities.length > 0">
          <div class="list">
            <community-info-card class="community-item" v-for="item in communities" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
          </div>
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
import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
import Scroller from '@/components/scroller'

import ListMixin from '@/mixins/list'

import { getBeaconsApi } from '@/api/pages/home'

@Component({
  name: 'home-index',
  components: {
    Swiper,
    SwiperItem,
    CommunityCard,
    communityInfoCard,
    Scroller
  },
  mixins: [ListMixin]
})
export default class HomeIndex extends Vue {
  // 顶部标签控制
  navTabName = 'find'
  // ******************* 已加入 **********************
  // 我加入的社区
  joins = []
  // ******************** 发现 ***********************
  // ******************** 精选 ***********************
  // banner图片列表
  banners = [
    { url: '/center/help', img: 'https://cdnstatic.zike.com/Uploads/static/beacon/head-banner.png' },
    { url: '/center/help', img: 'https://cdnstatic.zike.com/Uploads/static/beacon/sanyue.jpg' },
    { url: '/center/help', img: 'https://cdnstatic.zike.com/Uploads/static/beacon/head-banner-3.jpg' }
  ]
  // 我创建的社区
  creations = []
  // 社区列表
  communities = []
  ready = false

  created () {
    const routeName = this.$route.name
    if (routeName === 'home') {
      this.navTabName = 'find'
    } else {
      this.navTabName = routeName
    }

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
   * 切换nav
   **/
  toggle (targetName) {
    this.navTabName = targetName
    const name = targetName === 'find' ? 'home' : targetName
    this.$router.replace({name})
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
  padding: 50px 0;
  box-sizing: border-box;

  &.picked {
    padding: 90px 0 50px;
  }

  & .fixed {
    position:fixed;
    top:0;
    left:0;
    right:0;
    background:#fff;
    margin-top: 0;
    z-index: 99;
  }

  & .nav-bar {
    box-sizing: border-box;
    height: 49px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #929292;
    padding: 0 75px;
    background-color: #ffffff;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1); /* no */

    & span {
      height: 100%;
      line-height: 49px;
    }
    &.joined span:nth-of-type(1),
    &.find span:nth-of-type(2),
    &.picked span:nth-of-type(3) {
      color: #354048;
      font-weight: 500;
      position: relative;
    }

    &.joined span:nth-of-type(1):after,
    &.find span:nth-of-type(2):after,
    &.picked span:nth-of-type(3):after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      border-radius: 2px;
      background-color: #ffe266;
    }
  }

  & .classification {
    height: 40px;
    overflow-y: hidden;
    overflow-x: scroll;
    font-weight: 300;
    white-space: nowrap; /*不换行*/
    line-height: 40px;
    padding: 0 15px;

    & > span {
      margin-left: 25px;
      color: #929292;

      &:first-of-type {
        margin-left: 0;
      }

      &.selected {
        font-weight: 500;
        color: #d7ab70;
      }
    }
  }

  .banners {
    margin: 15px 15px 30px;
    border-radius: 3px;
    font-size: 0;
    line-height: 1;
    overflow: hidden;

    .m-banner-swiper {
      height: 100%;
      border-radius: 3px;
      overflow: hidden;

      .image-item {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        overflow: hidden;
      }
    }
  }

  .communities {
    padding: 10px 0 20px;

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

  & .community-empty {
    width: 120px;
    height: 120px;
    margin: 50px auto 0;
  }
  & .community-empty-desc {
    margin-top: 15px;
    color: #bcbcbc;
  }

  & .find-more-box {
    margin: 15px 0 25px;

    & .find-more {
      margin: 0 auto;
      display: block;
      width: 170px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-radius: 22px;
      border: solid 1px #d7ab70; /* no */
      color: #d7ab70;
    }
  }

  & .community-created {
    margin-top: 15px;
    text-align: center;
    font-weight: 300;
    & > span {
      color: #929292;
      text-decoration: underline;
    }
  }
}
</style>
