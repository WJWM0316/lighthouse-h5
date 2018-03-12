<template>
  <div class="p-reward-records p-body">
    <div class="top">
      <p class="money" v-text="orderAmount.toFixed(2)"></p>
      <p class="desc">累计收入</p>
      <a href="https://stg.ziwork.com/zikeappstatic/lighthousestatic/money/index.html" class="more u-btn">如何赚钱？</a>
    </div>

    <template v-if="records.length > 0">
      <div class="records">
        <h3 class="title">收入记录</h3>
        <scroller :refreshable="false":pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" :is-none-data="pagination.end">
          <ul class="list">
            <li v-for="(item, index) in records" :key="index">
              <div class="auto">
                <p class="content">成功推荐 {{item.realName}} 购买：{{item.title}}</p>
                <p class="time">{{item.createTime * 1000 | date('YYYY-MM-DD HH:mm')}}</p>
              </div>
              <p class="addon">+ {{item.price.toFixed(2)}}</p>
            </li>
          </ul>
        </scroller>
      </div>
      <footer class="g-footer">
        <router-link to="/" class="more-btn u-btn">去首页分享更多灯塔赚钱</router-link>
      </footer>
    </template>

    <div class="records records-empty" v-else>
      <h3 class="title">收入记录</h3>

      <div class="main">
        <div class="image">
          <i class="u-icon-empty" />
        </div>
        <p class="desc">暂无收入记录，快去分享赚钱吧～</p>
        <div class="btn-container">
          <router-link to="/" class="more-btn u-btn">去首页分享更多灯塔赚钱</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Scroller from '@/components/scroller'
import ListMixin from '@/mixins/list'

import { sellOrdersApi } from '@/api/pages/center'

@Component({
  name: 'reward-records',
  components: {
    Scroller
  },
  mixins: [ListMixin]
})
export default class CenterRewardRecords extends Vue {
  orderAmount = 0 // 总金额
  records = [] // 记录列表

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
      const { list, orderAmount, total } = await sellOrdersApi(params)
      this.orderAmount = orderAmount || 0
      this.records = page === 1 ? (list || []) : this.records.concat(list || [])

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
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-reward-records {
  padding-bottom: 60px;

  .top {
    position: relative;
    padding: 30px 15px 40px;
    text-align: center;

    .money {
      display: inline-block;
      position: relative;
      margin-bottom: 3px;
      line-height: 60px;
      font-size: 50px;
      font-weight: bold;
      color: @font-color-default;

      &::before {
        content: " ￥ ";
        position: absolute;
        right: 100%;
        bottom: 0;
        line-height: 34px;
        font-size: 15px;
        font-weight: normal;
      }
    }

    .desc {
      line-height: 22px;
      font-size: 15px;
      color: #929292;
    }

    .more {
      position: absolute;
      right: 0;
      top: 10px;
      padding: 7px 0 5px 16px;
      background: #ffe266;
      border-radius: 16px 0 0 16px;
      line-height: 20px;
      font-size: 13px;
      color: @font-color-default;
    }
  }

  .records {
    padding: 0 15px;

    .title {
      line-height: 38px;
      border-bottom: solid 1px #dcdcdc; /* no */
      font-size: 18px;
      font-weight: bold;
      color: #bcbcbc;
    }

    .list {
      line-height: 22px;
      font-size: 15px;

      & > li {
        .setFlex();
        padding: 15px 0;
        border-bottom: solid 1px #ededed; /* no */
      }

      .auto {
        flex: 1 1 auto;
      }

      .time {
        line-height: 20px;
        font-size: 13px;
        color: #929292;
      }

      .addon {
        flex: 0 0 auto;
        margin-left: 25px;
        align-self: center;
        color: #fa6a30;
      }
    }
  }

  .g-footer {
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 8px 22px;
    background: #fff;
    width: 100%;
    z-index: 10;
  }

  .more-btn {
    box-sizing: border-box;
    padding: 11px 22px 9px;
    background: #ffe266;
    width: 100%;
    line-height: 24px;
    border-radius: 22px;
    font-size: 15px;
    color: @font-color-default;
  }

  .records-empty {

    .main {
      padding: 40px 15px;
      text-align: center;

      .image {
        margin-bottom: 15px;
      }

      .desc {
        margin-bottom: 10px;
        line-height: 22px;
        font-size: 13px;
        color: #bcbcbc;
      }

      .more-btn {
        width: 230px;
      }
    }
  }
}
</style>
