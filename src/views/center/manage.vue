<template>
  <div class="p-manages"></div>
  <!--<div class="p-body p-classmates">-->
    <!--<scroller :pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" :is-none-data="pagination.end">-->
      <!--<div v-for='(item, index) in dataList' :key="index">-->
        <!--<classmate-item class='classmate-item'-->
                    <!--:item.sync='item'-->
                    <!--@tap-one='goUserDetail'-->
        <!--&gt;-->
        <!--</classmate-item>-->
      <!--</div>-->
    <!--</scroller>-->
  <!--</div>-->
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import ListMixin from '@/mixins/list'
  import Scroller from '@/components/scroller'
  import classmateItem from '@/components/classmateItem/classmateItem'
  import { XInput, XButton } from 'vux'
  import { classmatesApi } from '@/api/pages/pageInfo'

  @Component({
    name: 'p-manages',
    components: {
      Scroller,
      XInput,
      XButton,
      classmateItem
    },
    mixins: [ListMixin],
    methods: {
    }
  })
  export default class ClassmatesIndex extends Vue {
    communityId = ''
    dataList = []

    async getList ({page, pageSize} = {}) { // 请求列表
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
        const {list, total} = await classmatesApi({...params, communityId: this.communityId})
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
    goUserDetail (userId) {
      this.$router.push({name: 'userInfo-details', params: {userId}})
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
      this.communityId = this.$route.params.communityId
      this.getList()
    }
  }
</script>
<style lang="less" type="text/less">
  .p-manages {
  }
</style>
