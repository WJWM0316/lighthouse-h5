<template>
  <div class="p-body p-classmates-list">
    <!--<div class="toggle-tab fs15">-->
      <!--<button type="button" class="item u-btn" :class="{ 'z-active': type === 0 }" @click="handleSwitchTab(0)"><span>付费入社</span></button>-->
      <!--<button type="button" class="item u-btn" :class="{ 'z-active': type === 1 }" @click="handleSwitchTab(1)"><span>免费入社</span></button>-->
    <!--</div>-->
    <div class="classmates" v-if="list.length > 0">
      <scroller :pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" :is-none-data="pagination.end" :show-bottom-loading="!pagination.end">
        <ul class="list">
          <li v-for='item in list' @click.prevent.stop="handleUserDetail({ item })">
            <div class="head">
              <image-item class="image-item" :src="item.avatar" mode="horizontal" :round="true"></image-item>
              <i class="addon-icon" :class="[`u-icon-${item.gender === 1 ? 'boy' : 'girl'}`]" v-if="item.gender"></i>
            </div>
            <div class="info">
              <div class="wrapper">
                <h3 class="name" v-text="item.realName"></h3>
                <p class="desc" v-if="item.workTimeName || item.career || item.office">
                  <span v-if="item.workTimeName" v-text="item.workTimeName"></span>
                  <span v-if="item.career" v-text="item.career"></span>
                  <span v-if="item.office" v-text="item.office"></span>
                </p>
              </div>
            </div>
            <!--<p class="addon" v-if="item.num">{{type === 0 ? `￥${item.num}` : `${item.num}个Call`}}</p>-->
          </li>
        </ul>
        <div class="bottom" v-show="pagination.end">没有更多学员了，<a class="share" @click="handleToDetail">去分享吧</a></div>
      </scroller>
    </div>
    <div class="p-message" v-else>
      <div class="icon-container">
        <img class="icon" :src="iconSrc">
      </div>
      <div class="text">暂时没有相关学员哦～</div>
      <div class="btn-container">
        <button type="button" class="share u-btn" @click="handleToDetail">去分享</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import ClassmateItem from '@/components/classmateItem/classmateItem'
  import Scroller from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { getMyCommunityClassmatesApi } from '@/api/pages/center'

  @Component({
    name: 'login-index',
    components: {
      ClassmateItem,
      Scroller
    },
    mixins: [ListMixin],
  })
  export default class ExchangeListIndex extends Vue {
    iconSrc = 'http://cdnstatic.zike.com/Uploads/static/beacon/404.png'
    communityId = '' // 社区id
    type = 0 // 学员类型：0=>付费入社 1=>免费入社
    list = [] // 当前列表

    created () {
      const { type, communityId } = this.$route.params
      this.type = parseInt(type) || 0
      this.communityId = communityId
      this.init()
    }

    /**
     * 初始化
     */
    init () {
      this.pagination.page = 1
      this.pagination.end = false
      this.getList()
    }

    /**
     * 获取数据列表
     * @param page
     * @param pageSize
     * @return {Promise<void>}
     */
    async getList ({ page, pageSize } = {}) { // 请求列表
      if (this.pagination.end || this.pagination.busy) {
        // 防止多次加载
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize

      const params = {
        page: page,
        pageCount: pageSize,
        communityId: this.communityId,
        type: this.type
      }
      this.pagination.busy = true

      try {
        const { peoples, total } = await getMyCommunityClassmatesApi(params)
        this.list = page === 1 ? (peoples || []) : this.list.concat(peoples || [])
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
      await this.getList({ page: nextPage })
      if (this.pagination.end) {
        loaded('ended')
      } else {
        loaded('done')
      }
    }

    /**
     * 跳转到社区详情
     */
    handleToDetail () {
      this.$router.push({
        name: 'community',
        params: {
          communityId: this.communityId
        },
        query: {
          ...this.$route.query,
          showShare: true
        }
      })
    }

    /**
     * 切换tab
     * @param type
     */
    handleSwitchTab (type) {
      this.type = type
      this.list = []
      this.$router.replace(`/center/classmates/${this.communityId}/${this.type}`)
      this.init()
    }

    /**
     * 跳转到用户详情
     * @param item
     * @param event
     */
    handleUserDetail ({ item, event } = {}) {
      this.$router.push(`/userInfo/${item.userId}/details`)
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .p-classmates-list {
    /*padding-top: 44px;*/
    height: 100%;

    .toggle-tab {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      padding: 0 15px;
      background: #fff;
      border-bottom: solid 1px #dcdcdc; /* no */
      color: #929292;
      z-index: 99;

      .item {
        flex:  1 1 auto;
        height: 40px;
        line-height: 40px;

        &:active {
          background: #f1f1f1;
        }

        &.z-active {
          font-weight: 500;
          color: #354048;

          & > span:after {
            content: " ";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ffe266;
            height: 3px;
            border-radius: 1.5px;
          }
        }

        & > span {
          display: inline-block;
          position: relative;
        }
      }
    }

    .p-message {
      padding: 80px 15px 50px;
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

      .btn-container {
        margin-top: 50px;

        .share {
          padding: 10px 25px;
          background: #ffe266;
          min-width: 130px;
          line-height: 24px;
          border-radius: 22px;
          font-size: 16px;
          color: @font-color-default;
        }
      }
    }

    .classmates {
      padding-left: 15px;
      height: 100%;

      .list {

        &,
        & * {
          box-sizing: border-box;
        }

        & > li {
          .setFlex();
          /*align-items: center;*/
          padding: 15px 15px 15px 0;
          border-bottom: solid 1px #ededed; /* no */
        }

        .head,
        .addon {
          flex: 0 0 auto;
        }

        .head {
          position: relative;

          .image-item {
            width: 50px;
            height: 50px;
          }

          .addon-icon {
            position: absolute;
            right: 0;
            bottom: 0;
            top: auto;
          }
        }

        .info {
          position: relative;
          flex: 1 1 auto;

          .wrapper {
            .setFlex(@direction: column);
            justify-content: center;
            position: absolute;
            left: 0;
            top: 0;
            padding: 0 15px;
            width: 100%;
            height: 100%;
          }

          .name {
            line-height: 26px;
            font-weight: normal;
            font-size: 15px;
          }

          .desc {
            .setEllipsis();
            line-height: 24px;
            font-size: 13px;
            color: #929292;

            & > span {

              &:not(:first-child):before {
                content: " | ";
              }
            }
          }
        }

        .addon {
          line-height: 26px;
          align-self: center;
          font-size: 15px;
        }
      }

      .bottom {
        margin: 25px 15px;
        line-height: 24px;
        font-size: 13px;
        text-align: center;
        color: #bcbcbc;

        .share {
          color: #d7ab70;
        }
      }
    }
  }
</style>

