<template>

  <!-- 发现内容详情 -->
  <div class="explore-detail">

    <div class="fixed-box" v-show="isCeilingBoxFixed">
      <div class="ceiling-box fixed" :class="navTabName">
        <span @click="toggle('comment')">评论({{item.commentsTotal}})</span>
        <span @click="toggle('praise')">点赞({{item.favorTotal}})</span>
      </div>
    </div>

    <scroll @refresh="handleRefresh"
            @pullup="handlePullup"
            @scroll="scroll">
      <!-- header -->
      <div class="header">
        <explore :exploreList="exploreList"
                 :hideBorder="true"
                 :hideCommentArea="true"
                 :disableContentClick="true"
                 :isFold="false"
                 :showIdentification = "true"
                 :disableOperationArr="disableOperationArr"
                 :isDetailCon='true'
                 @disableOperationEvents="disableOperationEvents"
        ></explore>
      </div>

      <!-- container -->
      <div class="container">

        <div class="fixed-box" ref="ceiling-box">
          <div class="ceiling-box" :class="navTabName">
            <span @click="toggle('comment')">评论({{item.commentsTotal}})</span>
            <span @click="toggle('praise')">点赞({{item.favorTotal}})</span>
          </div>
        </div>
        <!-- 评论 -->
        <template v-if="navTabName === 'comment'">
        <div  v-for="item,index in allList">
            <!-- 热门评论 -->
          <div class="hot-area" v-if="hotCommentTotal > 0 && index ===0">
            <i class="hot-icon"><img src="../../assets/icon/icon_hotcomment@3x.png" alt=""></i>热门评论
          </div>
          <!-- 全部评论 -->

          <div class="hot-area" v-if="allTotal > 0 && hotCommentTotal === index">
            <i class="hot-icon"><img class="pic_1" src="../../assets/icon/tab-massage-3@3x.png" alt=""></i>全部评论
          </div>
          <div class="content-comment" >
            <discuss-item
                          :item="item"
                          :key="index"
                          :itemIndex="index"
                          :disableUserClick="true"
                          :disableContentClick="true"
                          :disableCommentAreaClick="true"
                          @operation="operation">
            </discuss-item>
          </div>
        </div>


        <div v-if="allTotal === 0">
          <p class="community-empty-desc fs13">成为第一个评论的人吧~</p>
        </div>

        </template>
        <!-- 点赞 -->
        <template v-else>
        <div class="content-praise">
          <classmate-item v-for="item, index in classmateList"
                          :item='item'
                          :key="index"
                          @tap-one="jump">
          </classmate-item>

          <div v-if="classmateList.length === 0">
            <p class="community-empty-desc fs13">成为第一个点赞的人吧~</p>
          </div>
        </div>
        </template>
      </div>

    </scroll>

    <div class="footer">
      <div class="page-operation">
        <div class="to-home" @click="toHome">
          <img src="./../../assets/icon/icon_home.png" class="icon-home" />
          <span>首页</span>
        </div>
        <button @click="toCommunity">立即加入</button>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import explore from '@/components/explore/explore'
  import discussItem from '@/components/discussItem/discussItem'
  import classmateItem from '@/components/classmateItem/classmateItem'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { getExploreDetailApi, getNewExploreCommentsApi, getFavorListApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'explore-detail',
    components: {
      explore,
      discussItem,
      classmateItem,
      Scroll
    },
    computed: {
      item () {
        return this.exploreList[0] || {}
      }
    },
    mixins: [ListMixin]
  })
  export default class exploreDetails extends Vue {
    exploreList = []
    allList = []
    allTotal = 0
    hotCommentTotal = 0
    classmateList = []
    navTabName = 'comment'
    isCeilingBoxFixed = false
    ceilingBoxTop = 0
    disableOperationArr = ['comment', 'praise']

    created () {
      this.pageInit().then(() => {})
    }
    /**
     * 跳转详情页
     */
    jump (e) {
      // this.$router.push('/userInfo/' + e + '/details')
    }
    /**
     * 切换nav
     **/
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
        if (targetName === 'praise') {
          let modelType = ''
          this.isShow = false
          modelType = this.$route.query.modeType
          const params = {
            id: this.$route.params.sourceId,
            modelType: modelType,
            page: 1,
            pageCount: 1000
          }
          if (this.classmateList.length === 0) {
            this.getFavorList(params).then(res => {
              this.classmateList = res.list
              console.log(res)
            })
          }
        } else {
          this.isShow = true
        }
      }
    }

    // ------------------- 评论区 ----------------------
    operation () {
      this.showTips()
    }
    disableOperationEvents () {
      this.showTips()
    }
    // ------------------------------------------------

    showTips () {
      const _this = this
      this.$vux.confirm.show({
        title: '加入灯塔',
        content: '解锁更多内容',
        confirmText: '去看看',
        cancelText: '取消',
        onCancel () {
        },
        onConfirm () {
          _this.$router.push(`/introduce/${_this.item.community.communityId}`)
        }
      })
    }
    toHome () {
      this.$router.push('/index')
    }
    toCommunity () {
      this.$router.push(`/introduce/${this.item.community.communityId}`)
    }

    async pageInit () {
      const { sourceId } = this.$route.params
      this.pagination.end = false // 初始化数据，必定不是最后一页

      let res = await this.getExploreDetail(sourceId)

      if (res['modelType'] === 'problem') {
        res['answers'].forEach((answer) => {
          answer.musicState = 0
          answer.progress = 0
        })
      } else if (res['circleType'] === 1) {
        res.musicState = 0
        res.progress = 0
      } else if (res['circleType'] === 2) {
        res.videoPlay = false
      }
      this.exploreList = [res]

      await this.getList({page: 1})

      this.$nextTick(() => {
        this.ceilingBoxTop = this.$refs['ceiling-box'].offsetTop
      })
    }

    // ------------------------------------------------
    /**
     * 发现内容详情
     **/
    getExploreDetail (id) {
      return getExploreDetailApi({
        id
      })
    }
    /**
     * 获取评论列表
     */
    getExploreComments (params) {
      return getNewExploreCommentsApi(params)
    }
    /**
     * 获取点赞列表
     */
    getFavorList (params) {
      return getFavorListApi(params)
    }
    // ------------------------------------------------

    async getList ({page, pageSize} = {}) {
      if (this.pagination.busy) {
        // 防止多次加载
        return
      }
      if (this.pagination.end) {
        this.$vux.toast.text('没有更多数据了', 'bottom')
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      const params = {
        id: this.$route.params.sourceId,
        modelType: 'circle',
        page: page,
        pageCount: pageSize
      }

      this.pagination.busy = true

      const navTabName = this.navTabName
      console.log(navTabName)
      let allTotal = 0
      if (navTabName === 'comment') {
        const res = await this.getExploreComments(params)
        const {comments, total, hotCommentTotal} = res
        this.allTotal = total
        this.hotCommentTotal = hotCommentTotal

        if (page === 1) {
          this.allList = comments
        } else {
          this.allList = this.allList.concat(comments || [])
        }
      }

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = allTotal
      this.pagination.end = this.isLastPage
      this.pagination.busy = false
    }

    /**
     * 加载下一页
     */
    async loadNext() {
      const nextPage = this.pagination.page + 1
      await this.getList({ page: nextPage })
    }

    /**
     * 下拉刷新
     */
    handleRefresh (loaded) {
      this.pageInit().then(res => {
        loaded('done')
      })
    }

    /**
     * 上拉加载
     */
    handlePullup (loaded) {
      this.loadNext().then(() => { loaded('done') })
    }

    scroll (e) {
      const ceilingBoxTop = this.ceilingBoxTop
      if (ceilingBoxTop) {
        const {scrollTop} = e.target
        this.isCeilingBoxFixed = scrollTop >= ceilingBoxTop
      }
    }
  }
</script>
<style lang="less" scoped>
  .explore-detail {
    box-sizing: border-box;
    padding-bottom: 49px;
    height: 100%;
    & .header {
    }
    
    & .ceiling-box {
      display: flex;
      align-items: center;
      color: #929292;
      font-size: 15px;
      width: 100%;
      padding-left: 15px;
      box-sizing: border-box;
      border-bottom: solid 1px #dcdcdc; /* no */

      
      & span {
        height: 40px;
        line-height: 40px;
        margin-left: 40px;
        padding: 0 5px;
        transform: translate(0, 1px);

        &:first-of-type {
          margin-left: 0;
        }
      }
      &.comment span:nth-of-type(1),
      &.praise span:nth-of-type(2) {
        color: #354048;
        font-weight: 700;
        position: relative;
      }
      &.comment span:nth-of-type(1):after,
      &.praise span:nth-of-type(2):after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        border-radius: 2px;
        background-color: #ffe266;
      }

      &.fixed {
        position:fixed;
        top:0;
        left:0;
        right:0;
        background:#fff;
        margin-top: 0;
        z-index: 99;
        padding: 0 15px; 
      }
    }
    & .hot-area {
      padding-left: 32px;
      font-size: 16px;
      line-height: 40px;
      color: #354048;
      background: #F8F8F8;
      .hot-icon {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 10px;
        .pic_1 {
          width: 17px;
          height: 17.5px;
        }
      }
    }
    & .container {
      padding-top: 4px;
      & .container-title {
        font-size: 15px;
        font-weight: 700;
        color: #354048;
        padding: 10px 0;
        margin: 0 15px;
        border-bottom: solid 1px #dcdcdc;  /* no */
      }

      & .content-comment {

      }
      & .content-praise {
        padding-right: 15px;
      }
    }

    & .community-empty {
      width: 120px;
      height: 120px;
      margin: 50px auto 0;
    }
    & .community-empty-desc {
      margin-top: 50px;
      color: #bcbcbc;
      text-align: center;
      margin-bottom: 30px;
    }

    .footer {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;

      & .page-operation {
        display: flex;
        align-items: center;
        border-top: solid 1px #ededed;  /* no */
        background: #FFF;
        height: 49px;

        & .to-home {
          flex: 0 0 auto;
          width: 46px;
          height: 100%;
          color: #929292;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          & > span {
            font-size: 11px !important;
          }
        }

        & > button　{
          flex: 1 1 auto;
          height: 49px;
          font-size: 16px;
          color: #354048;
          border-style: none;
          outline: none;
          line-height: 1;
          background-color: #ffe266;
          text-align: center;
        }
      }
    }

    & .icon-home {
      width: 18px;
      height: 17px;
      margin-bottom: 5px;
    }
  }
</style>
