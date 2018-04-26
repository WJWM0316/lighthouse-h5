<template>
  <div class="p-body p-home-index" :class="[{'hasBanner' : (isFlex || !bannerList && bannerList.length === 0)  && navTabName === 'picked'}, navTabName]">
    <div class="fixed">
      <!-- tab -->
      <div class="nav-bar fs15" :class="navTabName">
        <span @click="toggle('picked')">精选</span>
        <span class="join" :class="{'message': isMessage}" @click="toggle('joined')">已加入</span>
        <span class="create" @click="toggle('center-create-lite')">创建灯塔</span>
       <!--  <span @click="toggle('find')">发现</span> -->
      </div>
       <!-- 分类  用于悬浮顶格-->
      <div ref="tab1" class="classification fs14 tabFixed" v-if="navTabName === 'picked'"  v-show="isFlex || !bannerList && bannerList.length" @scroll.stop="scrollTab">
        <span v-for="itemTag, indexTag in communityTagList"
              :key="indexTag"
              :class="{selected: itemTag.selected}"
              v-text="itemTag.tagName"
              @click="tagSelected(indexTag)"></span>
      </div>
    </div>
<scroller @refresh="handleRefresh" @pullup="handlePullup" @scroll="scroll" :is-none-data="pagination.end">
      <!-- 选项卡 -->
      <div  ref="tabBanner" class="chose-tab" v-if="bannerList && bannerList.length > 0 && navTabName === 'picked'">
        <ul>
          <li v-for="(item, index) in bannerList" :key="`banner_${index}`" @click.prevent.stop="handleTapBanner(item)">
              <image-item class="chose-tab-img" :src="item.imgUrl" />
              <p class="chose-tab-con">{{item.title}}</p>
          </li>
        </ul>
      </div>
      <!-- 轮播图 -->
      <!-- <div class="banners" v-if="bannerList && bannerList.length > 0 && navTabName === 'picked'">
          <swiper class="m-banner-swiper" dots-class="banner-dots" dots-position="center" :show-desc-mask="false" :auto="true" :interval="5000" :aspect-ratio="290 / 345">
            <swiper-item v-for="(item, index) in bannerList" :key="`banner_${index}`">
              <a href="#" @click.prevent.stop="handleTapBanner(item)"><image-item class="image-item" :src="item.imgUrl" mode="horizontal" /></a>
            </swiper-item>
          </swiper>
      </div> -->
       <!-- 分类 -->
      <div ref="tab2" class="classification fs14" v-if="navTabName === 'picked'" v-show="!isFlex" @scroll.stop="scrollTab">
        <span v-for="itemTag, indexTag in communityTagList"
              :key="indexTag"
              :class="{selected: itemTag.selected}"
              v-text="itemTag.tagName"
              @click="tagSelected(indexTag)"></span>
      </div>
   

    

      <!-- 已加入 -->
      <div v-if="navTabName === 'joined'">

        <div class="joined-list">
          <!-- 创建的灯塔列表 -->
          <div class="module-home communities" :showFreeIdentification="false" v-if="creations && creations.length > 0">
            <!--<p class="module-home-title">已创建</p>-->
            <div class="list">
              <community-info-card class="community-item" :type="3" v-for="item in creations" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
            </div>
          </div>

          <!-- 已加入列表 -->
          <div class="module-home communities" :showFreeIdentification="false" v-if="joins && joins.length > 0">
            <!--<p class="module-home-title">已加入</p>-->
            <div class="list">
              <community-info-card class="community-item" :type="3" :cardType="'joined'" v-for="item in joins" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
            </div>
          </div>
        </div>

        <div v-if="joins.length === 0 && creations.length === 0">
          <div class="community-empty">
            <img src="./../../assets/page/empty.png" alt="">
          </div>
          <p class="community-empty-desc fs13">你还没加入任何灯塔，赶紧来加入吧～</p>
        </div>

        <div class="find-more-box" v-if="pagination.end">
          <span class="find-more" @click="findMore">发现更多灯塔</span>
          <!--<p class="community-created">-->
            <!--<span class="fs26">我也要创建灯塔</span>-->
          <!--</p>-->
        </div>

        <!-- 猜你喜欢 -->
        <div class="module-home likes communities" v-if="joins.length === 0 && creations.length === 0 && likes.length > 0">
          <p class="module-home-title">猜你喜欢</p>
          <div class="list">
            <community-info-card class="community-item" v-for="item in likes" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
          </div>
        </div>

      </div>

      

      <!-- 精选 -->
      <div v-if="navTabName === 'picked'">
        
        
        <div class="communities" v-if="communities && communities.length > 0">
          <div class="list">
            <community-info-card class="community-item" v-for="item in communities" :key="item.communityId" :cardType="'picked'" :community="item" @tap-card="handleTapCard(item)" />
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

import { getBeaconsApi, getBannersApi, getTagsListApi, getJoineListdApi, getTabBardApi } from '@/api/pages/home'

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
  navTabName = 'picked'
  // 社区列表
  ready = false
  isMessage = false
  // 悬浮控制
  isFlex = false
  scrollTabLeft = 0 // tab
  scrollHeight = 0 // 计算banner 跟 tab 的高度
  // ******************* 已加入 **********************
  creations = []
  joins = []
  likes = []
  
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
      this.navTabName = 'picked'
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
      this.communities = []
      this.navTabName = targetName
      const name = targetName === 'picked' ? 'home' : targetName
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
    this.getBanners()
    this.pickedInit().then(() => {})
  }

  scrollTab (e) {
    e.stopPropagation()
    e.preventDefault()
    this.scrollTabLeft = e.target.scrollLeft
  }

  findMore () {
    this.toggle('picked')
  }

  // ------------------------------------------------
  /**
   * 页面入口初始
   */
  async init () {
    const navTabName = this.navTabName
    this.pagination.end = false
    this.pagination.busy = false
    switch (navTabName) {
      case 'joined':
        await this.joinedInit()
        break
      default:
        await this.getBanners()
        await this.pickedInit()
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
    await this.getList({ page: 1 })
  }

  // ------------------------------------------------
  /**
   * 已加入
   **/
  getJoinedApi (params) {
    return getJoineListdApi(params)
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
    return getBannersApi().then(res => {
      this.bannerList = res
      if (res.length > 0) {
        this.$nextTick(() => {
          this.scrollHeight = this.$refs.tabBanner.clientHeight
        })
      }
    })
  }
  /**
   * 获取tab列表
   */
  getTagsList () {
    return getTagsListApi().then((res) => {
      if (res && res.length) {
        const tagId = this.pickedParams.tagId
        let tagIndex = 0
        res.forEach((tag, index) => {
          if (tagId === tag.id) {
            tagIndex = index
          }
        })
        res[tagIndex].selected = true
        console.log(res)

        this.communityTagList = res
      }
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
          res = await this.getJoinedApi(params)
          console.log('已加入: ', res)
          const {creations, joins, recommends} = res
          this.joins = page === 1 ? joins : this.joins.concat(joins || [])

          if (creations && page === 1) {
            this.creations = creations
          }

          if (recommends && page === 1) {
            this.likes = recommends
          }
          allTotal = res.total
          break
      }

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = allTotal
      this.pagination.end = this.isLastPage
      this.pagination.busy = false

      // 红点更新
      let {status} = await getTabBardApi()
      this.isMessage = Boolean(status)
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
   * 滚动监听
   */
  scroll (e) {
    const {scrollTop} = e.target
    if (scrollTop >= this.scrollHeight) {
      this.isFlex = true
      this.$refs.tab1.scrollLeft = this.scrollTabLeft
    } else {
      this.isFlex = false
      this.$refs.tab2.scrollLeft = this.scrollTabLeft
    }
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
    // padding: 113px 0 50px;
    padding: 49px 0 50px;
  }
  &.hasBanner {
     padding: 89px 0 50px;
    // padding: 259px 0 50px;
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

  & .tabFixed {
    position:fixed;
    top:49px;
    left:0;
    right:0;
    background:#fff;
    margin-top: 0;
    z-index: 99;
  }

  & .nav-bar {
    box-sizing: border-box;
    color: #929292;
    font-family: PingFangSC;
    font-size: 18px;
    line-height: 1.22;
    padding: 12px 15px 13px;
    background-color: #ffffff;
    /* box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);  */

    & span.join.message:before {
      content: '';
      position: absolute;
      right: 0px;
      top: 0px;
      width: 6px;
      height: 6px;
      background: #ff3434;
      border-radius: 50%;
    }

    & span {
      display: inline-block;
      height: 100%;
      line-height: 24px;
      position: relative;
      margin-right: 22px;
      vertical-align: top;
      &:nth-of-type(3) {
        margin-right: 0;
        float: right;
        font-size: 15px;
        color: #354048;
        font-weight: 300;
      }
    }
    &.joined span:nth-of-type(2),
    &.picked span:nth-of-type(1) {
      color: #354048;
      font-weight: 500;
      font-size: 24px;
      position: relative;
    }
  }

  & .classification {
    height: 40px;
    overflow-y: hidden;
    overflow-x: scroll;
    font-weight: 300;
    white-space: nowrap; /*不换行*/
    padding: 0 15px;
    background: #f8f8f8;
    & > span {
      margin-left: 25px;
      color: #929292;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      position: relative;
      &:first-of-type {
        margin-left: 0;
      }

      &.selected {
        font-weight: 500;
        color: #354048;
        
        &::before {
          content: '';
          width: 15px;
          height: 3px;
          border-radius: 22px;
          background: #ffe266;
          position: absolute;
          left: 50%;
          margin-left: -7.5px;
          bottom: 0;
        }
      }
    }
  }
  .chose-tab {
    ul {
      white-space: nowrap;
      font-size: 0;
      overflow-x: scroll;
      line-height: 0;
      li {
        width: 151px;
        display: inline-block;
        margin-left: 15px;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
        margin-bottom: 20px;
        &:last-child {
          margin-right: 15px;
        }
        .chose-tab-img {
          width: 100%;
          height: 93px;
          border-radius: 6px 6px 0 0;
        }
        .chose-tab-con {
          white-space: normal;
          width: 132px;
          height: 36px;
          font-family: PingFangSC;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.29;
          margin: 10px 10px 11px 0; 
          padding-left: 9px;
          .setEllipsisLn();
          position: relative;
          &::before {
            content: '';
            width: 3px;
            height: 12px;
            background-color: #ffe266;
            display: block;
            position: absolute;
            top: 5px;
            left: 0px;
          }
        }
      }
    }
  }
  /* .banners {
    margin: 13px 15px 0px;
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
  } */

  .joined-list {
    margin-top: 15px;
  }

  .communities {
    padding: 15px 0 0;

    & > .title {
      display: block;
      margin-bottom: 10px;
      line-height: 30px;
      font-weight: bold;
      font-size: 20px;
    }

    .community-item:not(:last-child) {
      margin-bottom: 15px;
    }
  }

  & .likes {
    margin-top: 15px;
  }

  & .module-home {
    & .module-home-title {
      font-size: 21px;
      font-weight: 500;
      color: #bcbcbc;
      padding: 0 15px 15px;
      border-bottom: solid 1px #ededed; /* no */
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
    text-align: center;
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
      font-weight: 300;
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
