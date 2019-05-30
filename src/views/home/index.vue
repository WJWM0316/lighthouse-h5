<template>
  <div class="p-body p-home-index" :class="[{'hasBanner' : (isFlex || !bannerList && bannerList.length === 0)  && navTabName === 'picked'}, navTabName]">
    <div class="fixed">
      <!-- tab -->
       <!-- 分类  用于悬浮顶格-->
      <div ref="tab1" class="classification fs14 tabFixed" v-show="isFlex || !bannerList && bannerList.length" @scroll.stop="scrollTab">
        <span v-for="itemTag, indexTag in communityTagList"
              :key="indexTag"
              :class="{selected: itemTag.selected}"
              v-text="itemTag.tagName"
              @click="tagSelected(indexTag)"></span>
      </div>
    </div>

    <scroller @refresh="handleRefresh" @infinite-scroll="handlePullup" @scroll="scroll" :is-none-data="pagination.end">
      <!--头部引导打开app-->
      <div class="appBtn">
        <app-guide :isToGuide="true"></app-guide>
      </div>
      <!--广告banner-->
      <div ref="insert" class="insert" >
        <img  class="insert_block" v-for="item, index in insertList" :src="item.imgUrl" @click.prevent.stop="handleTapBanner(item)"></img>
      </div>
      <!-- 选项卡 -->
      <div ref="tabBanner" class="chose-tab" v-if="bannerList && bannerList.length > 0">
        <div class="campTitle">热门推荐</div>
        <ul>
          <li v-for="(item, index) in bannerList" :key="`banner_${index}`" @click.prevent.stop="handleTapBanner(item)">
              <image-item class="chose-tab-img" :src="item.imgUrl" />
              <p class="chose-tab-con">{{item.name}}</p>
          </li>
        </ul>
      </div>

      <!--训练营-->
      <div v-if="trainingCampInfo && trainingCampInfo.pagination.total">
        <div class="campTitle">训练营</div>
        <div v-for="(item, index) in trainingCampInfo.lists">
          <training-camp :item="item"></training-camp>
        </div>
        <div class="moreCamp" v-if="trainingCampInfo.pagination.currentPage !== trainingCampInfo.pagination.lastPage">
          <div class="moreCampBtn" @click.stop="toCampList">查看更多训练营</div>
        </div>
      </div>

      <!--课程标题-->
      <div class="courseTitle" >职场精品课</div>
       <!-- 分类 -->
      <div ref="tab2" class="classification fs14" @scroll.stop="scrollTab">
        <span v-for="itemTag, indexTag in communityTagList"
              :key="indexTag"
              :class="{selected: itemTag.selected}"
              v-text="itemTag.tagName"
              @click="tagSelected(indexTag)"
              v-show="!isFlex"></span>
      </div>

      <!-- 精选 -->
      <div>
        <div class="communities" v-if="communities && communities.length > 0">
          <div class="list">
            <community-info-card class="community-item" v-for="item in communities" :key="item.communityId" :cardType="'picked'" :community="item" @tap-card="handleTapCard(item)" v-if="item.communityId != teacherId"/>
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
import { Swiper, SwiperItem } from 'vux'
import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
import explore from '@/components/explore/explore'
import Scroller from '@/components/scroller'
import ListMixin from '@/mixins/list'
import trainingCamp from '@/components/trainingCamp/trainingCamp'
import { getBeaconsApi, getTagsListApi, getTabBardApi, getAdvertisingApi } from '@/api/pages/home'

@Component({
  name: 'home-index',
  components: {
    Swiper,
    SwiperItem,
    communityInfoCard,
    explore,
    Scroller,
    appGuide,
    trainingCamp
  },
  mixins: [ListMixin]
})
export default class HomeIndex extends Vue {
  // 顶部标签控制
  navTabName = 'picked'
  // 社区列表
  ready = false
  isMessage = false
  joinLd = false
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
  insertList = '' //广告插页
  advertisingList = [] //广告推荐
  trainingCampInfo = '' //训练营数据




  teacherId="38ecff5824a5436f604d4b0362b7c6be" // 活动结束记得要删掉

  toLiveTest() {
    this.$router.push({name: 'liveDetail'})

  }
  created () {
    const routeName = this.$route.name
    if (routeName === 'home') {
      this.navTabName = 'picked'
    } else {
      
      this.navTabName = 'joined'
    }
    this.init()
  }

  beforeMount(){
  }

  mounted(){
    this.getAdvertising()
  }

  updated(){
  }
  
  /* 去训练营列表 */
  toCampList () {
    this.$router.push({path: '/campList'})
  }

  toggleCreate () {
    this.$router.push({name: 'center-create-lite'})
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

    this.pickedInit()
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

    await this.pickedInit()
    this.ready = true
  }

  /**
   * 精选 Tab 初始
   */
  async pickedInit () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    this.getAdvertises()
    this.getTagsList()
    await this.getList({ page: 1 })
  }

  // ------------------------------------------------

  /**
   * 精选
   **/
  getPickedApi (params) {
    return getBeaconsApi(params)
  }

  //获取广告
  getAdvertises () {
    this.getInsert()
    this.getBanners()
  }
  /**
   * 获取banner列表
   */
  getBanners () {
    if (this.bannerList.length > 0) {
      return
    }
    let test = 40
    return getAdvertisingApi({
      adType: test
    }).then(res => {
      this.bannerList = res.ads
      
    })
  }

  /**
   * 获取三个广告位
   */
  getAdvertising () {
    let id = 42
    return getAdvertisingApi({
      adType: id
    }).then((res) => {
      this.advertisingList = res.ads
      setTimeout(()=>{
        this.setStick()
      },100)
    })
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

  /**
   * 获取广告插页
   */
  getInsert () {
    let id = 101
    if (this.insertList) {
      return
    }
    return getAdvertisingApi({
      adType: id
    }).then((res) => {
      this.insertList = res.ads
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

      res = await this.getPickedApi({
        ...params,
        ...this.pickedParams
      })
      const communities = res.list
      this.trainingCampInfo = res.topTrainingCamp
      this.communities = page === 1 ? communities : this.communities.concat(communities || [])
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
    if (this.navTabName === 'picked') {
      //if (scrollTop >= this.scrollHeight) {
      if (scrollTop >= this.$refs.tab2.offsetTop) {
        this.isFlex = true
        this.$refs.tab1.scrollLeft = this.scrollTabLeft
      } else {
        this.isFlex = false
        this.$refs.tab2.scrollLeft = this.scrollTabLeft
      }
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
  &.picked {
    /*padding: 50px 0 50px;*/
  }
  &.hasBanner {
     /*padding: 89px 0 50px;*/
  }

  & .fixed {
    position:fixed;
    top:0;
    left:0;
    right:0;
    background:#fff;
    margin-top: 0;
    z-index: 99;
    background: #fff;
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
  
  .tab{
    width: 100%;
    min-height: 57px;
  }

  .insert_block {
    width: 351px;
    height: 104px;
    margin: 0 auto 13px auto;
    display: block;
    border-radius: 3px;
  }
  .advertising_list {
    margin: 0 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 15px;
    padding-top: 6px;
    .opt_blo {
      width: 111px;
      height: 48px;
      border-radius: 3px;
      position: relative;
      line-height: 48px;
      text-align: left;
      overflow: hidden;
      .opt_pic {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }
      text {
        //font-family: 'PingFangSC-Regular';
        .fontSize(14);
        color: #354048;
        letter-spacing: 0;
        margin-left: 12px;
      }
    }
    
  }
  /*训练营标题 ， 课程标题*/
  .campTitle, .courseTitle{
    margin-top: 25px;
    color: #354048;
    font-size: 18px;
    font-weight: 700;
    padding-bottom: 8px;
    margin-left: 25px;
    position: relative;
    &::before{
      display: block;
      content: '';
      height: 19px;
      width: 19px;
      background-color: #FFE266;
      position: absolute;
      top: -2px;
      left: -10px;
      z-index: -1;
    }
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

  & .classification {
    height: 40px;
    overflow-y: hidden;
    overflow-x: auto;
    font-weight: 300;
    white-space: nowrap; /*不换行*/
    padding: 0 15px;
    background: #f8f8f8;
    &::-webkit-scrollbar {
      //background-color:transparent;
      width:0; height: 0;
      display: none;
    }
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
        font-weight: 700;
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
    ul{
      white-space: nowrap;
      font-size: 0;
      overflow-x: scroll;
      line-height: 0;
      &::-webkit-scrollbar {
        background:rgba(0,0,0,0);
        width: 0 !important;
        height: 0;
      }
      li {
        width: 130px;
        display: inline-block;
        margin-left: 10px;
        margin-bottom: 2px;
        vertical-align: top;
        &:first-child {
          margin-left: 15px;
        }
        &:last-child {
          margin-right: 15px;
        }
        .chose-tab-img {
          width: 100%;
          height: 80px;
          border-radius: 3px;
        }
        .chose-tab-con {
          white-space: normal;
          width: 132px;
          /*height: 36px;*/
          .fontSize(13);
          line-height: 1.29;
          margin: 6px 8px 0px 1px; 

          font-weight: 400;
          color: #354048;
          letter-spacing: 0;
          .setEllipsisLn();
          position: relative;
        }
      }
    }
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
}
</style>
