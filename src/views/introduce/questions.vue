<template>
  <div class="p-body p-questions">
    <div class="g-header">
      <div class="topbar">
        <div class="tabs">
          <button class="item u-btn" :class="{ 'z-active': payType === 2 }" @click="handleSwitchTab(2)">
            <span class="text">必答问题<span class="addon" v-if="freeQuestionNum > 0">{{freeQuestionNum}}</span></span>
          </button>
          <button class="item u-btn" :class="{ 'z-active': payType === 1 }" @click="handleSwitchTab(1)">
            <span class="text">付费问题<span class="addon" v-if="payQuestionNum > 0">{{payQuestionNum}}</span></span>
          </button>
        </div>
        <div class="filter">
          <button class="control u-btn" :class="{ 'z-active': openFilters }" @click="handleSwitchFilters">{{filterControlText}} <i class="u-icon-caret-down" /></button>
          <div class="list" :class="{ 'z-active': openFilters }">
            <p class="item" @click="handleFilterStatus(0)">全部</p>
            <p class="item" @click="handleFilterStatus(1)">未回答</p>
            <p class="item" @click="handleFilterStatus(2)">已回答</p>
            <p class="item" @click="handleFilterStatus(3)">有追问</p>
            <p v-if="payType === 1" class="item" @click="handleFilterStatus(4)">已过期</p>
          </div>
        </div>
      </div>
    </div>

    <scroller :pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" :is-none-data="pagination.end">
      <div class="questions">
        <question-item v-for="(item, index) in questions" :key="index" class="question" :model="item" :showDetails="false" :communityId="communityId" @card-tap="handleItemTap" />
      </div>
    </scroller>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import Scroller from '@/components/scroller'
import QuestionItem from '@/components/questionItem'

import ListMixin from '@/mixins/list'

import { getProblemListApi } from '@/api/pages/qa'

@Component({
  name: 'questions',
  components: {
    Scroller,
    QuestionItem
  },
  mixins: [ListMixin]
})
export default class Questions extends Vue {
  communityId = '' // 社区id
  payType = 2 // tab类型 1 => 付费问题；2 => 必答问题
  status = 0 // 问题状态 0 => 全部；1 => 未回答；2 => 已回答；3 => 有追问；4 => 已过期
  freeQuestionNum = 0 // 必答问题未读数
  payQuestionNum = 0 // 付费问题未读数
  questions = []
  openFilters = false // 是否打开筛选列表
  filterControlText = '筛选'

  created () {
    this.communityId = this.$route.params.communityId
    if (!this.$root.$children[0].audio.paused) {
      this.$root.$children[0].audio.pause()
    }
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
        pageCount: pageSize,
        payType: this.payType,
        status: this.status,
        communityId: this.communityId
      }

      this.pagination.busy = true
      const { problem, problemFreeNum, problemPayNum, total } = await getProblemListApi(params)
      this.questions = page === 1 ? (problem || []) : this.questions.concat(problem || [])
      this.freeQuestionNum = problemFreeNum
      this.payQuestionNum = problemPayNum

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
   * 切换筛选列表
   */
  switchFilters (flag) {
    if (flag === undefined) {
      this.switchFilters(!this.openFilters)
      return
    }

    this.openFilters = flag
  }

  /**
   * 筛选条件
   */
  filterStatus (status) {
    if (this.status !== status) {
      const statusOptions = {
        0: '全部',
        1: '未回答',
        2: '已回答',
        3: '有追问',
        4: '已过期'
      }
      this.status = status
      this.filterControlText = statusOptions[status]
      this.init()
    }
    this.switchFilters(false)
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
   * 切换tab
   * @param {Number} payType
   */
  handleSwitchTab (payType) {
    if (this.payType !== payType) {
      this.payType = payType
      this.status = 0
      this.filterControlText = '筛选'
      this.init()
    } else {}
  }

  /**
   * 切换筛选列表
   */
  handleSwitchFilters () {
    this.switchFilters()
  }

  /**
   * 点击筛选条件
   */
  handleFilterStatus (status) {
    this.filterStatus(status)
  }

  /**
   * 点击问题卡片
   */
  handleItemTap (communityId, item) {
    this.$router.push(`/introduce/replyQuestion/${communityId}/${item.problemId}`)
  }
}
</script>

<style lang="less">
@import "../../styles/variables";
@import "../../styles/mixins";

.p-questions {
  box-sizing: border-box;
  padding-top: 51px;
  background: #f9f9f9;
  min-height: 100%;

  .topbar {
    .setFlex();
    background: #fff;

    .tabs {
      .setTabs();
      flex: 1 1 auto;
    }

    .filter {
      position: relative;
      flex: 0 0 auto;
      margin-right: 12px;

      .control {
        display: inline-block;
        padding: 18px 0 14px;
        line-height: 18px;
        font-size: 13px;
        color: #929292;

        &.z-active {
          .icon {
            transform: rotate(180deg);
          }
        }

        .icon {
          position: relative;
          top: -1px;
          width: 15px;
          height: 15px;
          vertical-align: middle;
          transition: all 300ms;
        }
      }

      .list {
        display: none;
        position: absolute;
        right: 0;
        top: 45px;
        background: #fff;
        min-width: 72px;
        border-radius: 3px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .08);
        overflow: hidden;

        // &::after {
        //   content: " ";
        //   display: block;
        //   position: absolute;
        //   right: 25px;
        //   bottom: 100%;
        //   background: #f9f9f9;
        //   width: 8px;
        //   height: 5px;
        // }

        &.z-active {
          display: block;
        }

        .item {
          display: block;
          padding: 10px;
          line-height: 20px;
          font-size: 14px;
          text-align: center;
          color: #666;

          &:active {
            background: #f9f9f9;
          }

          &:not(:last-child) {
            border-bottom: solid 1px #ededed; /* no */
          }
        }
      }
    }
  }

  .questions {
    .question:not(:last-of-type) {
      margin-bottom: 10px;
    }
  }
}
</style>
