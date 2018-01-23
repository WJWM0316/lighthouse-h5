<template>
  <div class="p-body p-classmates-list">
    <div class="toggle-tab fs15" :class="typeClassList[applyType -1]">
      <div @click="toggle(1)">付费入社</div>
      <div @click="toggle(2)">免费入社</div>
    </div>
    <div class="apply-list" v-if="dataList.length > 0">
      <scroller :pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" :is-none-data="pagination.end" :show-bottom-loading="!pagination.end">
        <div v-for='item in dataList'>
          <classmate-item class='community-item'
                          :item.sync='item'
                          @tap-one='goUserDetail'></classmate-item>
        </div>
        <div class="bottom-content">没有更多学员了，<span class="bottom-share" @click="goDetail">去分享吧</span></div>
      </scroller>
    </div>
    <div class="p-message" v-else>
      <div class="icon-container">
        <img class="icon" :src="iconSrc">
      </div>
      <div class="text">还没有申请哦～</div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import classmateItem from '@/components/classmateItem/classmateItem'
  import Scroller from '@/components/scroller'
  import { XInput, XButton } from 'vux'
  import ListMixin from '@/mixins/list'
  import { applyListApi, handleDetailsApi } from '../../api/pages/exchange.js'

  @Component({
    name: 'login-index',
    components: {
      XInput,
      XButton,
      classmateItem,
      Scroller
    },
    mixins: [ListMixin],
  })
  export default class ExchangeListIndex extends Vue {
    typeClassList = ['one', 'two']
    dataList = []
    iconSrc = 'http://cdnstatic.zike.com/Uploads/static/beacon/404.png'
    goApplyDetail (id, userId) {
      this.$router.push({name: 'exchange-detail', params: {id, userId, type: this.applyType}})
    }
    goUserDetail (userId, LighthouseId) {
      console.log('跳去用户详情，暂时不要的')
    }
    goCommunityDetail (LighthouseId) {
      console.log('跳去社区详情，暂时不要的')
    }
    get applyType () {
      const iniType = parseInt(this.$route.query.type)
      console.log('iniType', iniType)
      return iniType || 1 // 类型：1我收到的申请，2我发出的申请
    }
    async handleDetails (id, LighthouseId) { // 直接同意申请
      console.log('LighthouseId', LighthouseId)
      try {
        await handleDetailsApi({id, LighthouseId, handleStatus: 1, refuseReason: this.refuseReason})
        this.$vux.toast.text('已同意申请', 'bottom')
        this.pagination.end = false
        this.getList()
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
      console.log('直接同意申请', id, LighthouseId)
    }
    goDetail () {
      this.$router.push({name: 'community', params: {communityId: '6e0804d662ce053f2070fee37fcf1907'}, query: {...this.$route.query, showShare: true}})
    }
    toggle (type) {
      this.dataList = []
      this.pagination.end = false
      this.$router.replace(`/exchange/list?type=${type}`)
      this.getList({ page: 1 })
    }
    async getList ({ page, pageSize } = {}) { // 请求列表
      if (this.pagination.end || this.pagination.busy) {
        // 防止多次加载
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      if (this.isLastPage && page !== 1) return
      const params = {
        page: page,
        pageCount: pageSize
      }
      this.pagination.busy = true
      try {
        const {list, total} = await applyListApi({...params, type: this.applyType})
        this.dataList = page === 1 ? (list || []) : this.dataList.concat(list || [])
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = total
        this.pagination.end = this.isLastPage
        this.pagination.busy = false
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
    }
    /**
     * 下拉刷新
     */
    async handleRefresh (loaded) {
      this.pagination.end = false
      await this.getList({page: 1})
      loaded('done')
    }

    /**
     * 上拉加载
     */
    async handlePullup (loaded) {
      const nextPage = this.pagination.page + 1
      await this.getList({page: nextPage})
      if (this.pagination.end) {
        loaded('ended')
      } else {
        loaded('done')
      }
    }

    created () {
      this.getList()
    }

    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  .p-classmates-list {
    padding-top: 44px;
    height: 100%;
    .toggle-tab {
      position: fixed;
      left: 15px;
      top: 0;
      right: 15px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #929292;
      background: #fff;
      z-index: 99;

      & div {
        height: 40px;
        line-height: 40px;
      }
      &.one div:first-of-type,
      &.two div:last-of-type {
        color: #354048;
        font-weight: 500;
        position: relative;
      }
      &.one div:first-of-type:after,
      &.two div:last-of-type:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        border-radius: 1.5px;
        background-color: #ffe266;
      }
    }
    .p-message {
      padding: 120px 15px 50px;
      text-align: center;
      .icon-container {
        margin-bottom: 18px;

        .icon {
          width: 130px;
          height: 130px;
        }
      }
      .text {
        line-height: 21px;
        font-size: 15px;
        color: #bcbcbc;
      }
    }
    .apply-list {
      height: 100%;
      .bottom-content{
        height: 70px;
        color: #bcbcbc;
        display: flex;
        align-items: center;
        justify-content: center;
        .bottom-share{
          color: #d7ab70;
        }
      }
    }
  }
</style>

