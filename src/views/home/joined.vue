<template>
  <div class="p-body p-home-index">
    <ul class="navList" :class="{'fixed': isNavFixed}" v-if="isNavFixed">
      <li :class="{'cur':nowNavType === 1}" @click="toggleNav(1)">全部内容</li>
      <li :class="{'cur':nowNavType === 2}" @click="toggleNav(2)">精品课</li>
      <li :class="{'cur':nowNavType === 3}" @click="toggleNav(3)">直播课</li>
      <li :class="{'cur':nowNavType === 4}" @click="toggleNav(4)">训练营</li>
    </ul>

    <scroller @refresh="handleRefresh" @infinite-scroll="handlePullup" @scroll="scroll" :is-none-data="pagination.end">
      <!--头部引导打开app-->
      <div class="appBtn">
        <app-guide :isToGuide="true"></app-guide>
      </div>
      <ul class="navList" ref="nav">
        <li :class="{'cur':nowNavType === 1}" @click="toggleNav(1)">全部内容</li>
        <li :class="{'cur':nowNavType === 2}" @click="toggleNav(2)">精品课</li>
        <li :class="{'cur':nowNavType === 3}" @click="toggleNav(3)">直播课</li>
        <li :class="{'cur':nowNavType === 4}" @click="toggleNav(4)">训练营</li>
      </ul>
      <!-- 已加入 -->
      <div >
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
              <community-info-card class="community-item" :type="3" :cardType="'joined'" v-for="item in joins" :key="item.communityId" :isCourse="item.isCourse" :community="item" @tap-card="handleTapCard(item)" v-if="item.communityId != teacherId" />
            </div>
          </div>
        </div>

        <div v-if="joins.length === 0 && creations.length === 0 && joinLd">
          <div class="community-empty">
            <img src="./../../assets/page/empty.png" alt="">
          </div>
          <p class="community-empty-desc fs13">你还没加入任何灯塔，赶紧来加入吧～</p>
        </div>

        <div class="find-more-box" v-if="pagination.end">
          <span class="find-more" @click="findMore">发现更多灯塔</span>
        </div>

        <!-- 猜你喜欢 -->
        <div class="module-home likes communities" v-if="joins.length === 0 && creations.length === 0 && likes.length > 0">
          <p class="module-home-title">猜你喜欢</p>
          <div class="list">
            <community-info-card class="community-item" v-for="item in likes" :key="item.communityId" :cardType="'picked'" :community="item" @tap-card="handleTapCard(item)" />
          </div>
        </div>
      </div>

    </scroller>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import appGuide from '@/components/appGuide/appGuide'
import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
import Scroller from '@/components/scroller'
import ListMixin from '@/mixins/list'
import { getTagsListApi, getJoineListdApi, getTabBardApi } from '@/api/pages/home'

@Component({
  name: 'home-index',
  components: {
    communityInfoCard,
    Scroller,
    appGuide,
  },
  mixins: [ListMixin]
})
export default class HomeIndex extends Vue {
  // 社区列表
  ready = false
  isMessage = false
  joinLd = false
  // 悬浮控制
  isNavFixed = false
  scrollTabLeft = 0 // tab
  scrollHeight = 0 // 计算banner 跟 tab 的高度
  // ******************* 已加入 **********************
  creations = []
  joins = []
  likes = []
  nowNavType = 1

  teacherId="38ecff5824a5436f604d4b0362b7c6be" // 活动结束记得要删掉

  toLiveTest() {
    this.$router.push({name: 'liveDetail'})

  }
  created () {
    this.init()
  }

  beforeMount(){
  }

  mounted(){
  }

  updated(){
  }

  toggleNav (num) {
    if(num === this.nowNavType) return
    this.nowNavType = num
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
    this.pagination.end = false
    this.pagination.busy = false
    await this.joinedInit()
    this.ready = true
  }

  /**
   * 加入 Tab 初始
   */
  async joinedInit () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    await this.getList({ page: 1 })
  }

  // ------------------------------------------------
  /**
   * 已加入
   **/
  getJoinedApi (params) {
    return getJoineListdApi(params)
  }

  // 置顶
  setStick () {
    this.$nextTick(() => {
      let tabBanner = this.$refs.tabBanner ? parseInt(this.$refs.tabBanner.clientHeight) : 0
      let advertising = this.$refs.advertising ? parseInt(this.$refs.advertising.clientHeight) : 0
      let insert = this.$refs.insert ? parseInt(this.$refs.insert.clientHeight) : 0

      if (tabBanner>0 && advertising>0 && insert>0) {
        this.scrollHeight = tabBanner+advertising+insert

      }else if(tabBanner>0 && advertising>0){
        this.scrollHeight = tabBanner+advertising

      }else if(tabBanner>0 && insert>0){
        this.scrollHeight = tabBanner+insert
        
      }else if(advertising>0 && insert>0){
        this.scrollHeight = advertising+insert

      }else if(advertising>0){
        this.scrollHeight = advertising

      }else if(insert>0){
        this.scrollHeight = insert
        
      }else if(tabBanner>0){
        this.scrollHeight = tabBanner
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

      let res = ''
      let allTotal = 0
      res = await this.getJoinedApi(params)
      const {creations, joins, recommends} = res
      this.joins = page === 1 ? joins : this.joins.concat(joins || [])
      if (creations && page === 1) {
        this.creations = creations
      }
      if (recommends && page === 1) {
        this.likes = recommends
      }
      // todo
      if(this.joins.length == 0 && this,creations.length == 0){
        this.joinLd = true;
      }else {
        this.joinLd = false;
      }


      allTotal = res.total
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
    if (scrollTop >= this.$refs.nav.offsetTop) {
      this.isNavFixed = true
      //this.$refs.tab1.scrollLeft = this.scrollTabLeft
    } else {
      this.isNavFixed = false
      //this.$refs.tab2.scrollLeft = this.scrollTabLeft
    }
  }

  /**
   * 点击卡片
   */
  handleTapCard (item) {
    let url = ''
    if (item.isAuthor === 1 || item.isJoined === 1) {
      //如果已经加入并且已入社跳转到入社后页面
      //1 有课。2 无课。3课节
      if(item.isCourse === 3 || item.isCourse === 4){
        url = `/introduce2/${item.communityId}/community`
      }else {
        url = `/introduce/${item.communityId}/community`
      }
    } else { // 未入社跳到未入社页面
      //1 有课。2 无课。3课节
      if(item.isCourse == 3 || item.isCourse === 4){
        url = `/introduce2/${item.communityId}`
      }else {
        url = `/introduce/${item.communityId}`
      }
    }
    this.$router.push(url)
  }

  // 点击广告列
  toAdvertising (type) {
    if (type) {
      this.$router.push(`/advertising/${type}`)
    }
  }

  toTest (){
    this.$router.push(`/active_11`)
  }
}
</script>
<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";
@import "../../styles/dprPx";
.p-home-index {
  /*padding: 50px 0 50px;*/
  box-sizing: border-box;
  &.hasBanner {
     /*padding: 89px 0 50px;*/
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

  .navList {
    height:44px;
    background:rgba(251,251,251,1);
    display: flex;
    &.fixed {
      position:fixed;
      top:0px;
      left:0;
      right:0;
      z-index: 99;
    }
    li {
      height: 100%;
      line-height: 44px;
      font-size:13px;
      font-weight:500;
      color: #929292;
      margin: 0 20px;
      position: relative;
      span {
        margin-left: 5px;
      }
      &.cur {
        color: #354048;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 10%;
          width: 80%;
          height: 2px;
          background: #FFE266;
        }
      }
    }
  }

  .tab{
    width: 100%;
    min-height: 57px;
  }
  /* 查看更多训练营按钮 */
  .moreCamp{
    padding: 0 22px;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    margin-bottom: 30px;
    margin-top: 15px;
    .moreCampBtn{
      font-size: 14px;
      font-weight: 300;
      color: #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #F8F8F8;
      border-radius: 20px;
    }
  }
  .joined-list {
    margin-top: 2px;
  }
  .communities {
    padding: 15px 0 0;

    & > .title {
      display: block;
      margin-bottom: 10px;
      line-height: 30px;
      font-weight: bold;
      .fontSize(20);
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
      .fontSize(21);
      font-weight: 500;
      color: #bcbcbc;
      padding: 0 15px 15px;
      //border-bottom: solid 1px #ededed; /* no */
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
