<template>
  <div class="p-body p-home-index" v-if="communities.length>0">
    <scroller @refresh="handleRefresh" @pullup="handlePullup"  :is-none-data="pagination.end">
    <div class="communities" v-if="communities && communities.length > 0" >
      <div class="list">
        <community-info-card class="community-item" v-for="item in communities" :key="item.communityId" :cardType="'picked'" :community="item" @tap-card="handleTapCard(item)" />
      </div>
    </div>
    </scroller>

  </div>
  <div class="test_blo" v-else>
    <img src="./../../assets/page/empty.png" alt="">
    <p class="test" >暂时没有相关内容哦～</p>
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

import { getBeaconsApi } from '@/api/pages/home'

@Component({
  name: 'home-index',
  components: {
    communityInfoCard,
    Scroller
  },
  mixins: [ListMixin]
})
export default class HomeIndex extends Vue {
  communities = []
  // ******************* 已加入 **********************
  pickedParams = { // 页面所需参数
    tagId: 0
  }

  created () {
    console.log(this.$route)
    this.init().then(() => {})
  }

  // ------------------------------------------------
  /**
   * 页面入口初始
   */
  async init () {
    this.pagination.end = false
    this.pagination.busy = false
    await this.getList({ page: 1 })
    this.ready = true

  }
  
  /**
   * 精选
   **/
  getPickedApi (params) {
    return getBeaconsApi(params)
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
    console.log(this.pagination.end ,this.pagination.busy)
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
      this.pickedParams.tagId = this.$route.params.type
      let res = ''
      let allTotal = 0

      res = await this.getPickedApi({
        ...params,
        ...this.pickedParams
      })
      console.log('精选: ', res)
      const communities = res.list
      this.communities = page === 1 ? communities : this.communities.concat(communities || [])
      allTotal = res.total


      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = allTotal
      this.pagination.end = this.isLastPage
      this.pagination.busy = false

      // 红点更新
      this.isMessage = Boolean(status)
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  /**
   * 下拉刷新
   */
  handleRefresh (loaded) {
    console.log('下拉刷新')
    setTimeout(() => {
      this.init()
      loaded('done')
    }, 500)
  }

  /**
   * 上拉加载
   */
  handlePullup (loaded) {
    console.log('上拉加载')
    setTimeout(() => {
      this.loadNext()
      loaded('done')
    }, 500)
  }

  /**
   * 点击卡片
   */
  handleTapCard (item) {
    let url = ''
    if (item.isAuthor === 1 || item.isJoined === 1) {
     //  如果已经加入并且已入社跳转到入社后页面
      if(item.isCourse == 3){
        url = `/introduce2/${item.communityId}/community`
      }else {
        url = `/introduce/${item.communityId}/community`
      }
    } else { // 未入社跳到未入社页面
      if(item.isCourse == 3){
        url = `/introduce2/${item.communityId}`
      }else {
        url = `/introduce/${item.communityId}`
      }
    }
    this.$router.push(url)
  }

}
</script>
<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";
.test_blo {
  img {
    width: 60px;
    height: 60px;
    margin: 40px auto 20px;
    display: block;
  }
  .test {
    text-align: center;
    font-size: 14px;
    color: #929292;
    //font-family: PingFangSC-Light;
    font-weight: 300;
  }
}

.p-home-index {
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
