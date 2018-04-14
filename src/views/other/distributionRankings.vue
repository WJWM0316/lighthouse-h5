<template>

  <!-- 社区排行榜 -->
  <div class="distribution-rankings">
    <!-- header -->
    <div class="header">
      <p class="title">影响力排行榜</p>
    </div>
    <!-- body -->
    <div class="container">
      <!-- 菜单栏 -->
      <div class="menu">
        <div class="user-img">
          <img :src="pageInfo.avatar" alt="">
        </div>
        <div class="user-info">
          <p v-text="pageInfo.realName"></p>
          <p v-if="pageInfo.ranking > 0">当前排名: {{pageInfo.ranking}}</p>
          <p v-else>暂无排名(需至少邀请1人)</p>
        </div>
        <div class="user-count">
          <p v-text="pageInfo.support"></p>
          <p>已获得支持数</p>
        </div>
      </div>

      <ul class="rank-list">
        <li class="rank-item" v-for="item,index in pageInfo.list">
          <i class="rank-index flex-0">{{index > 2 ? item.ranking : ''}}</i>
          <div class="rank-img flex-0">
            <img :src="item.avatar" alt="">
          </div>
          <p class="rank-name flex-1" v-text="item.realName"></p>
          <p class="rank-count flex-0">已有 <span v-text="item.support"></span> 人支持</p>
        </li>
      </ul>
    </div>

    <!-- footer -->
    <div class="footer" @click="toOther">
      <p>邀请好友加入灯塔，获取丰厚奖励</p>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {rankingApi} from '@/api/pages/pageInfo'

  @Component({
    name: 'distribution-rankings'
  })
  export default class distributionRankings extends Vue {
    pageInfo = {}

    async pageInit () {
      const { communityId } = this.$route.params
      const res = await rankingApi({communityId})
      this.pageInfo = res
    }

    toOther () {
      let { communityId } = this.$route.params
      if (this.pageInfo.communityId) {
        communityId = this.pageInfo.communityId
      }
      this.$router.push(`/introduce/${communityId}`)
    }

    created () {
      this.pageInit().then(() => {})
    }
  }
</script>
<style lang="less" scoped type="text/less">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .distribution-rankings {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;

    img {
      width: 100%;
      height: auto;
      max-width: 100%;
    }

    .header {
      flex: 0 0 auto;
      height: 120px;
      background-color: #1b1b1f;
      font-size: 26.5px;
      text-align: center;
      color: #ffe266;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 40px;
      box-sizing: border-box;

      .title {
        font-weight: 100;
        margin: 0 20px;
      }

      &::before, &::after {
        content: '';
        display: inline-block;
        height: 1px;
        width: 15px;
        background: #ffe266;
      }
    }

    .container {
      flex: 1 1 auto;
      position: relative;
      margin: 0 20px;
      line-height: 1;
      padding-bottom: 49px;

      .menu {
        position: absolute;
        display: flex;
        height: 80px;
        border-radius: 4px;
        background: #FFF;
        top: -40px;
        left: 0;
        right: 0;
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
        align-items: center;
        padding: 12.5px 20px;
        font-weight: 300;
        color: #929292;

        .user-img {
          flex: 0 0 auto;
          width: 55px;
          height: 55px;
          background: pink;
          border-radius: 50%;
          overflow: hidden;
        }
        .user-info {
          flex: 1 1 auto;
          margin-left: 12px;
          font-size: 13px;
          & p:nth-of-type(1) {
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 500;
            color: #354048;
          }
        }
        .user-count {
          flex: 0 0 auto;
          text-align: center;
          font-size: 11px;
          & p:nth-of-type(1) {
            margin-bottom: 5px;
            font-weight: 500;
            font-size: 34px;
            color: #354048;
          }
        }
      }

      .rank-list {
        padding: 80px 0 0;
        height: 100px;

        .rank-item {
          display: flex;
          align-items: center;
          margin-bottom: 25px;

          &:nth-of-type(1) .rank-index {
            background: url('./../../assets/icon/rank_1.png') no-repeat center;
            background-size: cover;
          }
          &:nth-of-type(2) .rank-index {
            background: url('./../../assets/icon/rank_2.png') no-repeat center;
            background-size: cover;
          }
          &:nth-of-type(3) .rank-index {
            background: url('./../../assets/icon/rank_3.png') no-repeat center;
            background-size: cover;
          }

          .rank-index, .rank-img {
            border-radius: 50%;
            overflow: hidden;
          }
          .rank-index {
            display: inline-block;
            min-width: 29px;
            height: 29px;
            margin-right: 15px;
            font-size: 16px;
            font-weight: 300;
            font-style: normal;
            text-align: center;
            line-height: 29px;
          }
          .rank-img {
            width: 30px;
            height: 30px;
            background: pink;
            margin-right: 10px;
          }
          .rank-name {
            font-size: 15px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin-right: 15px;
          }
          .rank-count {
            font-size: 13px;
            & span {
              color: #d7ab70;
            }
          }
          .flex-0 {
            flex: 0 0 auto;
          }
          .flex-1 {
            flex: 1 1 auto;
          }
        }
      }
    }

    .footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 49px;
      line-height: 49px;
      color: #354048;
      background: #ffe266;
      font-size: 15px;
      text-align: center;
    }
  }
</style>
