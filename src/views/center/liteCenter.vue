<template>
  <div class="p-lite-center p-body">
    <scroller :pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" :is-none-data="pagination.end">
      <div class="community-list">
        <my-community-item class="item" v-for="item in communities" :key="item.communityId" :model="item" @tap-item="handleTapItem({ item })" />
      </div>
    </scroller>

    <footer class="g-footer">
      <router-link to="/center/createLite" class="create u-btn">创建新灯塔</router-link>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Scroller from '@/components/scroller'
import MyCommunityItem from '@/components/myCommunityItem'
import ListMixin from '@/mixins/list'
import { getMyCommunityListApi } from '@/api/pages/center'

@Component({
  name: 'lite-center',
  components: {
    Scroller,
    MyCommunityItem
  },
  mixins: [ListMixin],
  filters: {
    // 社区状态过滤
    getStatus (item) {
      const now = new Date().getTime() / 1000
      if (now > item.endTime) {
        // 结束则展示已结束
      }
    }
  }
})
export default class CenterLiteCenter extends Vue {
  communities = [] // 社区列表

  created () {
    this.init()
  }

  /**
   * 页面初始化
   */
  init () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    return this.getList({ page: 1 })
  }

  /**
   * 加载下一页
   */
  loadNext() {
    const nextPage = this.pagination.page + 1
    return this.getList({ page: nextPage })
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
        pageCount: pageSize
      }

      this.pagination.busy = true
      const { list, total } = await getMyCommunityListApi(params)
      this.communities = page === 1 ? (list || []) : this.questions.concat(list || [])

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = total
      this.pagination.end = this.isLastPage
      this.pagination.busy = false

      return Promise.resolve()
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
      return Promise.reject(error)
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
    this.loadNext().then(() => {
      if (this.pagination.end) {
        loaded('ended')
      } else {
        loaded('done')
      }
    }).catch(() => {
      loaded('done')
    })
  }

  /**
   * 点击社区项
   */
  handleTapItem ({ item, event } = {}) {
    this.$router.push(`/introduce/${item.communityId}/community`)
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-lite-center {
  padding-bottom: 50px;
  background: #f8f8f8;

  .community-list {

    & > .item {
      margin-bottom: 10px;
    }
  }

  .g-footer {
    border-top: solid 1px #dcdcdc; /* no */

    .create {
      box-sizing: border-box;
      padding: 13px 15px 12px;
      background: #fff;
      width: 100%;
      line-height: 24px;
      font-size: 15px;
      color: @font-color-default;

      &:active {
        background: #f1f1f1;
      }
    }
  }
}
</style>
