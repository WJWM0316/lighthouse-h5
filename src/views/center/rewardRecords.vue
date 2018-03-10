<template>
  <div class="p-reward-records p-body">
    <div class="top">
      <p class="money">1221.56</p>
      <p class="desc">累计收入</p>
      <router-link to="/" class="more u-btn">如何赚钱？</router-link>
    </div>

    <div class="records">
      <h3 class="title">收入记录</h3>
      <ul class="list">
        <li>
          <div class="auto">
            <p class="content">成功推荐 David 购买：通往百万百年薪之路</p>
            <p class="time">2018-01-30 22:23</p>
          </div>
          <p class="addon">+ 108.66</p>
        </li>
      </ul>
    </div>

    <footer class="g-footer">
      <router-link to="/" class="more u-btn">去首页分享更多灯塔赚钱</router-link>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'reward-records'
})
export default class CenterRewardRecords extends Vue {}
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
      font-weight: normal;
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

      .time {
        line-height: 20px;
        font-size: 13px;
        color: #929292;
      }

      .addon {
        margin-left: 25px;
        flex: 0 0 auto;
        align-self: center;
        color: #fa6a30;
      }
    }
  }

  .g-footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
}
</style>
