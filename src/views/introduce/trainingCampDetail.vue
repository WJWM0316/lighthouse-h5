<template>
  <div class="campDetail">
    <community-card></community-card>
    <!--<div class="share-group">
      <div class="group_wrap">
        <button type="button" class="home u-btn" @click="toHome"><i class="u-icon-community-home"></i></button>
        <button type="button" class="invite u-btn" v-if="!pageInfo.isAudit && pageInfo.isSell === 2" @click="showSell = true">邀请函</button>
        <button type="button" class="money u-btn" v-else-if="!pageInfo.isAudit && pageInfo.isSell === 1" @click="showSell = true">
          ¥{{pageInfo.sellPrice}}
        </button>
        <button type="button" class="share u-btn" v-else @click="showShare = true"><i class="u-icon-share-community"></i></button>
      </div>
      <span class="money_other" v-if="!pageInfo.isAudit && pageInfo.isSell === 1">
        分享赚
        <img src="../../assets/icon/bg_share.png" />
      </span>
    </div>-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import CommunityCard from '@/components/communityCard_v2'
  @Component({
    name: 'campDetail',
    components: {
      CommunityCard
    }
  })
  export default class campDetail extends Vue {
    toHome () {
      this.$router.push({path: '/home'})
    }
  }
</script>

<style lang="less" scoped="scoped">
  @import "../../styles/variables";
  @import "../../styles/mixins";
  @import "../../styles/dprPx";
  .campDetail {
    .share-group {
      position: absolute;
      right: 10px;
      top: 25px;
      line-height: 1;
      font-size: 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
      z-index: 99;
      border-radius: 16px;
      height: 32px;
      .group_wrap {
        overflow: hidden;
        width: 100%;
        height: 32px;
        border-radius: 16px;
        background: #fff;
      }
      .money_other {
        width: 60px;
        height: 23px;
        position: absolute;
        right: 0;
        top: -20px;
        border-raidus: 40px;
        .fontSize(12);
        font-family: PingFangSC-Regular;
        color: rgba(53, 64, 72, 1);
        line-height: 18px;
        text-align: center;
        z-index: 100;
        img {
          width: 60px;
          height: 23px;
          position: absolute;
          right: 0;
          top: 0;
          z-index: -1;
        }
      }
      &.fixed {
        position: fixed;
      }
      .u-btn {
        position: relative;
        line-height: 18px;
        .fontSize(12);
        color: @font-color-default;
        &:first-child {
          padding: 8px 10px 6px 12px;
        }
        &:last-child {
          padding: 8px 13px 6px 10px;
        }
        &.home,
        &.share {
          background: #fff;
          &:active {
            background: #f1f1f1;
          }
        }
        &.type_2 {
          padding: 8px 10px 6px 12px;
        }
        &.type_3 {
          padding: 6px 11px 6px 10px;
        }
        &.share:after {
          content: " ";
          display: block;
          position: absolute;
          right: 100%;
          top: 8px;
          background: #d8d8d8;
          width: 1px;
          /* no */
          height: 18px;
        }
        &.invite,
        &.money {
          height: 32px;
          padding: 0px 15px 0px 12px;
          background: #ffe266;
        }
      }
    }
  }
</style>