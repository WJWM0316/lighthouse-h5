<template>
  <div class="p-lite-center p-body">
    <scroller :pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" :is-none-data="pagination.end">
      <ul class="community-list">
        <li v-for="item in communities">
          <div class="bd">
            <div class="left">
              <h3 class="title" v-text="item.title"></h3>
              <p class="desc" v-text="item.simpleIntro">我曾经实现，相信你也可以做得到</p>
              <div class="other">
                <p class="status">招募中</p>
                <p class="time"><span class="countdown">22 天 06：33：52</span> 后开启</p>
              </div>
            </div>
            <div class="cover">
              <image-item class="image-item" :src="item.icon" mode="horizontal" />
            </div>
          </div>
          <footer class="ft">
            <router-link to="/" class="share u-btn"><i class="u-icon-share-gray" /> 分享</router-link>
            <router-link to="/" class="free u-btn">免费学员({{item.freeJoinedNum}})</router-link>
            <router-link to="/" class="pay u-btn">付费学员({{item.payJoinedNum}})</router-link>
          </footer>
        </li>
        <li>
          <div class="bd">
            <div class="left">
              <h3 class="title">通往百万年薪之路</h3>
              <p class="desc">我曾经实现，相信你也可以做得到</p>
              <div class="other">
                <p class="status">已开启</p>
                <p class="time">2018-03-01 至 2018-07-01</p>
              </div>
            </div>
            <div class="cover">
              <image-item class="image-item" :src="''" mode="horizontal" />
            </div>
          </div>
          <footer class="ft">
            <a href="#" class="share u-btn"><i class="u-icon-share-gray" /> 分享</a>
            <a href="#" class="free u-btn">免费学员(50)</a>
            <a href="#" class="pay u-btn">付费学员(250)</a>
          </footer>
        </li>
        <li>
          <div class="bd">
            <div class="left">
              <h3 class="title">通往百万年薪之路</h3>
              <p class="desc">我曾经实现，相信你也可以做得到</p>
              <div class="other">
                <p class="status">已满员</p>
                <p class="time">2018-03-01 至 2018-07-01</p>
              </div>
            </div>
            <div class="cover">
              <image-item class="image-item" :src="''" mode="horizontal" />
            </div>
          </div>
          <footer class="ft">
            <a href="#" class="share u-btn"><i class="u-icon-share-gray" /> 分享</a>
            <a href="#" class="free u-btn">免费学员(50)</a>
            <a href="#" class="pay u-btn">付费学员(250)</a>
          </footer>
        </li>
        <li>
          <div class="bd">
            <div class="left">
              <h3 class="title">通往百万年薪之路</h3>
              <p class="desc">我曾经实现，相信你也可以做得到</p>
              <div class="other">
                <p class="status">已结束</p>
                <p class="time">停止报名</p>
              </div>
            </div>
            <div class="cover">
              <image-item class="image-item" :src="''" mode="horizontal" />
            </div>
          </div>
          <footer class="ft">
            <a href="#" class="share u-btn"><i class="u-icon-share-gray" /> 分享</a>
            <a href="#" class="free u-btn">免费学员(50)</a>
            <a href="#" class="pay u-btn">付费学员(250)</a>
          </footer>
        </li>
      </ul>
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
import ListMixin from '@/mixins/list'
import { getMyCommunityListApi } from '@/api/pages/center'

@Component({
  name: 'lite-center',
  components: {
    Scroller
  },
  mixins: [ListMixin]
})
export default class CenterLiteCenter extends Vue {
  communities = [] // 社区列表

  created () {
    // this.init()
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
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-lite-center {
  padding-bottom: 50px;
  background: #f8f8f8;

  .community-list {

    & > li {
      margin-bottom: 10px;
      background: #fff;
    }

    .bd {
      .setFlex();
      padding: 20px 15px 15px;

      .left {
        flex: 1 1 auto;

        .title {
          line-height: 22px;
          font-size: 18px;
        }

        .desc {
          margin-bottom: 3px;
          line-height: 24px;
          font-size: 13px;
          color: #666;
        }

        .other {
          line-height: 1;

          .status,
          .time {
            display: inline-block;
            vertical-align: middle;
            line-height: 20px;
            font-size: 13px;
          }

          .status {
            padding: 0 8px;
            background: rgba(255, 226, 102, .15);
            min-width: 56px;
            text-align: center;
            color: @color-primary;

            &.z-overed {
              background: #f8f8f8;
              color: #bcbcbc;
            }
          }

          .time {
            color: #929292;

            .countdown {
              color: @color-primary;
            }
          }
        }
      }

      .cover {
        flex: 0 0 auto;

        .image-item {
          background: #ccc;
          width: 70px;
          height: 70px;
          border-radius: 3px;
        }
      }
    }

    .ft {
      .setFlex();
      border-top: solid 1px #ededed; /* no */

      .u-btn {
        box-sizing: border-box;
        position: relative;
        flex: 1 1 auto;
        padding: 14px 15px 12px;
        line-height: 24px;
        font-size: 15px;
        color: @font-color-default;

        &:active {
          background: #f1f1f1;
        }

        &:not(:last-child)::after {
          content: " ";
          display: block;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -12px;
          background: #ededed;
          width: 1px; /* no */
          height: 24px;
        }

        &.share {
          flex: 0 0 auto;
          min-width: 88px;
        }
      }
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
