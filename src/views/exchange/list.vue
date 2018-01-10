<template>
  <div class="p-body p-exchange-list">
    <div class="toggle-tab fs15" :class="typeClassList[applyType -1]">
      <div @click="toggle(1)">我收到的申请</div>
      <div @click="toggle(2)">我发出的申请</div>
    </div>
    <div class="apply-list">
      <scroller @refresh="handleRefresh" @pullup="handlePullup">
      <div v-for='item in dataList'>
        <apply-item class='community-item'
                    @tap-one='goApplyDetail'
                    @tap-two='goUserDetail'
                    @tap-three='goCommunityDetail'
                    @tap-four='handleDetails'
                    :type='applyType'
                    :item="item"></apply-item>
      </div>
      </scroller>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import ApplyItem from '@/components/applyItem/applyItem'
  import Scroller from '@/components/scroller'
  import { XInput, XButton } from 'vux'
  import ListMixin from '@/mixins/list'
  import { applyListApi, handleDetailsApi } from '../../api/pages/exchange.js'

  @Component({
    name: 'login-index',
    components: {
      XInput,
      XButton,
      ApplyItem,
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
    toggle (type) {
      this.dataList = []
      this.pagination.end = false
      this.$router.replace(`/exchange/list?type=${type}`)
      this.getList({ page: 1 })
    }
    async getList ({ page, pageSize } = {}) { // 请求列表
      console.log('前', this.pagination.end, this.pagination.busy)
      if (this.pagination.end || this.pagination.busy) {
        // 防止多次加载
        return
      }
      console.log('后', this.pagination.end, this.pagination.busy)
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
        this.$vux.toast.text(e.message, 'middle')
      }
    }
    /**
     * 下拉刷新
     */
    async handleRefresh (loaded) {
      await this.getList({ page: 1 })
      loaded('done')
    }

    /**
     * 上拉加载
     */
    async handlePullup (loaded) {
      const nextPage = this.pagination.page + 1
      await this.getList({ page: nextPage })
      loaded('done')
    }
    created () {
      this.getList()
    }

    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  .p-exchange-list {
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
    }
  }
</style>

