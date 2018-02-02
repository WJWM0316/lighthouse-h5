<template>

  <!-- 发现内容详情 -->
  <div class="explore-detail">
    <scroll @refresh="handleRefresh" @pullup="handlePullup">
      <!-- header -->
      <div class="header">
        <explore :exploreList="exploreList"
                 :hideBorder="true"
                 :hideCommentArea="true"
                 :disableContentClick="true"
        ></explore>
      </div>

      <!-- container -->
      <div class="container">
        <div class="container-title">评论({{pagination.total}})</div>
        <discuss-item v-for="item,index in discussItemList"
                      :item="item"
                      :key="index"
                      :itemIndex="index"
                      @operation="operation"></discuss-item>
      </div>
    </scroll>
    <!-- footer -->
    <div class="footer">
    </div>

  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import explore from '@/components/explore/explore'
  import discussItem from '@/components/discussItem/discussItem'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { getExploreDetailApi, getExploreCommentsApi, setFavorApi, setSubmitCommentApi, delCommontApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'explore-details',
    components: {
      explore,
      discussItem,
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
    discussItemList = []

    created () {
      this.pageInit().then(() => {})
    }

    // ------------------- 评论区 ----------------------
    operation (e) {
      const {eventType, itemIndex} = e
      const item = this.discussItemList[itemIndex]
      switch (eventType) {
        case 'comment':
          break
        case 'praise':
          break
        case 'del':
          break
      }
    }
    // ------------------------------------------------

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
      return getExploreCommentsApi(params)
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
      const res = await this.getExploreComments(params)
      const {topComments, total} = res

      if (page === 1) {
        this.discussItemList = topComments
      } else {
        this.discussItemList = this.discussItemList.concat(topComments || [])
      }

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = total
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
  }
</script>
<style lang="less" scoped>
  .explore-details {
    box-sizing: border-box;
    padding-bottom: 50px;
    height: 100%;
    & .header {
    }

    & .container {
      & .container-title {
        font-size: 15px;
        font-weight: 500;
        color: #354048;
        padding: 10px 0;
        margin: 0 15px;
        border-bottom: solid 1px #dcdcdc;  /* no */
      }
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

        & > button　{
          flex: 1 1 auto;
          height: 50px;
          font-size: 15px;
          color: #666666;
          border-style: none;
          outline: none;
          line-height: 1;
          background-color: transparent;
          text-align: center;
        }

        & .split {
          width: 1px;
          height: 20px;
          background-color: #dcdcdc;
        }
      }

      & .icon-zan, & .icon-pinglun {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 2px;
      }
    }
  }
</style>
