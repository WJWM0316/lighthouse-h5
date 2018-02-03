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
        <span v-for="itemTag, indexTag in communityTagList"
              :key="indexTag"
              :class="{selected: itemTag.selected}"
              v-text="itemTag.tagName"
              @click="tagSelected(indexTag)"></span>
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
          <div class="community-empty">
            <img src="./../../assets/page/empty.png" alt="">
          </div>
          <p class="community-empty-desc fs26">你还没加入任何灯塔，赶紧来加入吧～</p>
        </div>

        <div class="find-more-box" v-if="pagination.end">
          <span class="find-more">发现更多灯塔</span>
          <p class="community-created">
            <span class="fs26">我也要创建灯塔</span>
          </p>
        </div>

      </div>

      <!-- 发现 -->
      <div v-if="navTabName === 'find'">
        <explore :exploreList="finds"
                 :disableOperationArr="disableOperationArr"
                 @disableOperationEvents="disableOperationEvents"
        ></explore>
      </div>

      <!-- 精选 -->
      <div v-if="navTabName === 'picked'">

        <div class="banners">
          <swiper class="m-banner-swiper" dots-class="banner-dots" dots-position="center" :show-desc-mask="false" :auto="true" :interval="5000" :aspect-ratio="290 / 345">
            <swiper-item v-for="(item, index) in bannerList" :key="`banner_${index}`">
              <a href="#" @click.prevent.stop="handleTapBanner(item)"><image-item class="image-item" :src="item.imgUrl" mode="horizontal" /></a>
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

  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import { Swiper, SwiperItem } from 'vux'
import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
import explore from '@/components/explore/explore'
import Scroller from '@/components/scroller'

import ListMixin from '@/mixins/list'

import { getBeaconsApi, getBannersApi, getTagsListApi, getSelectionApi } from '@/api/pages/home'

@Component({
  name: 'home-index',
  components: {
    Swiper,
    SwiperItem,
    communityInfoCard,
    explore,
    Scroller
  },
  mixins: [ListMixin]
})
export default class HomeIndex extends Vue {
  // 顶部标签控制
  navTabName = 'find'
  // 社区列表
  ready = false
  disableOperationArr = ['comment', 'praise']

  // ******************* 已加入 **********************
  joins = []
  // ******************** 发现 ***********************
  finds = []
  // ******************** 精选 ***********************
  bannerList = []
  communities = []
  communityTagList = []
  pickedParams = { // 页面所需参数
    tagId: 0
  }

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
   * 切换nav
   **/
  toggle (targetName) {
    if (this.navTabName !== targetName) {
      this.ready = false
      this.joins = []
      this.finds = []
      this.communities = []
      this.navTabName = targetName
      const name = targetName === 'find' ? 'home' : targetName
      this.$router.replace({name})
      this.init().then(() => {})
    }
  }

  /**
   * 切换 Tag 标签
   **/
  tagSelected (tagIndex) {
    const communityTagList = this.communityTagList
    if (communityTagList[tagIndex].id === this.pickedParams.tagId) {
      return
    }

    this.pickedParams.tagId = communityTagList[tagIndex].id
    this.communities = []
    this.bannerList = []

    this.pickedInit().then(() => {})
  }

  disableOperationEvents (e) {
    const {eventType} = e
    console.log(eventType, '拦截')
  }

  // ------------------------------------------------
  /**
   * 页面入口初始
   */
  async init () {
    const navTabName = this.navTabName
    switch (navTabName) {
      case 'picked':
        await this.pickedInit()
        break
      case 'joined':
        await this.joinedInit()
        break
      default:
        await this.findInit()
        break
    }
    this.ready = true
  }

  /**
   * 加入 Tab 初始
   */
  async joinedInit () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    console.log('加入 Tab 初始')

    await this.getList({ page: 1 })
  }

  /**
   * 精选 Tab 初始
   */
  async pickedInit () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    console.log('精选 Tab 初始')

    await this.getTagsList()
    this.bannerList = await this.getBanners()
    await this.getList({ page: 1 })
  }

  /**
   * 发现 Tab 初始
   */
  async findInit () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    console.log('发现 Tab 初始')

    await this.getList({ page: 1 })
  }

  // ------------------------------------------------
  /**
   * 已加入
   **/
  getJoinedApi (params) {
    return getBeaconsApi(params)
  }
  /**
   * 发现
   **/
  getFindApi (params) {
    return getSelectionApi(params)
  }
  /**
   * 精选
   **/
  getPickedApi (params) {
    return getBeaconsApi(params)
  }
  /**
   * 获取banner列表
   */
  getBanners () {
    return getBannersApi(this.pickedParams)
  }
  /**
   * 获取banner列表
   */
  getTagsList () {
    return getTagsListApi().then((res) => {
      const tagId = this.pickedParams.tagId
      let tagIndex = 0
      res.forEach((tag, index) => {
        console.log(tagId, tag.id)
        if (tagId === tag.id) {
          tagIndex = index
        }
      })
      res[tagIndex].selected = true
      console.log(res)

      this.communityTagList = res
    })
  }
  // ------------------------------------------------

  /**
   * 加载下一页
   */
  loadNext() {
    const nextPage = this.pagination.page + 1
    this.getList({ page: nextPage }).then(() => {})
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

      const navTabName = this.navTabName
      let res = ''
      let allTotal = 0

      switch (navTabName) {
        case 'picked':
          res = await this.getPickedApi({
            ...params,
            ...this.pickedParams
          })
          console.log('精选: ', res)
          const communities = res.list
          this.communities = page === 1 ? communities : this.communities.concat(communities || [])
          allTotal = res.total
          break
        case 'joined':
          break
        default:
          res = await this.getFindApi(params)
          res.list.forEach((item) => {
            if (item['modelType'] === 'problem') {
              item['answers'].forEach((answer) => {
                answer.musicState = 0
                answer.progress = 0
              })
            } else if (item['circleType'] === 1) {
              item.musicState = 0
              item.progress = 0
            } else if (item['circleType'] === 2) {
              item.videoPlay = false
            }
          })
          console.log('发现: ', res)
          this.finds = res.list
          allTotal = res.total
          break
      }

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = allTotal
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
  handleTapBanner (item) {
    location.href = item.url
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
      /*margin-bottom: 35px;*/
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
