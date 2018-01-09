<template>
  <div class="p-classmates">
      <div v-for='(item, index) in dataList'>
        <classmate-item class='classmate-item'
                    :item.sync='item'
                    @tap-one='goUserDetail'
        >
        </classmate-item>
      </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import ListMixin from '@/mixins/list'
  import Scroller from '@/components/scroller'
  import messageItem from '@/components/messageItem/messageItem'
  import { XInput, XButton } from 'vux'
  import { messageListApi } from '@/api/pages/message'

  @Component({
    name: 'p-classmates',
    components: {
      Scroller,
      XInput,
      XButton,
      messageItem
    },
    mixins: [ListMixin],
    methods: {
    }
  })
  export default class ClassmatesIndex extends Vue {
//    dataList = []
//    async getList ({page, pageSize} = {}) { // 请求列表
//      if (this.pagination.end || this.pagination.busy) {
//        // 防止多次加载
//        return
//      }
//      page = page || this.pagination.page || 1
//      pageSize = pageSize || this.pagination.pageSize
//      if (this.isLastPage && page !== 1) return
//      const params = {
//        page: page,
//        pageCount: pageSize
//      }
//      this.pagination.busy = true
//      try {
//        const {list, total} = await messageListApi(params)
//        this.dataList = page === 1 ? (list || []) : this.dataList.concat(list || [])
//        this.pagination.page = page
//        this.pagination.pageSize = pageSize
//        this.pagination.total = total
//        this.pagination.end = this.isLastPage
//        this.pagination.busy = false
//      } catch (e) {
//        this.$vux.toast.text(e.message, 'middle')
//      }
//    }
//
//    /**
//     * 下拉刷新
//     */
//    async handleRefresh (loaded) {
//      await this.getList({page: 1})
//      loaded('done')
//    }
//
//    /**
//     * 上拉加载
//     */
//    async handlePullup (loaded) {
//      const nextPage = this.pagination.page + 1
//      await this.getList({page: nextPage})
//      loaded('done')
//    }
//
//    created () {
//      this.getList()
//    }
  }
</script>
<style lang="less" type="text/less">
  .p-classmates {
    padding-top: 5px;
    .userInfo {
      display: flex;
      font-size: 13px;
      color: #929292;
      margin-bottom: 20px;
      & text:first-of-type {
        font-size: 18px;
        margin-bottom: 8px;
        color: #354048;
        font-weight: 600;
      }
    }
  }
</style>
