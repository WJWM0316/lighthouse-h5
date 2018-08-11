<template>
  <!-- 朋友圈动态列表项 -->
  <div class="share-group">
    <div class="group_wrap">
      <button type="button" class="home u-btn" @click="toHome"><i class="u-icon-community-home"></i></button>
      <button type="button" class="invite u-btn" v-if="!pageInfo.isAudit && pageInfo.isSell === 2" @click="showSell = true">邀请函</button> 
      <button type="button" class="money u-btn" v-else-if="!pageInfo.isAudit && pageInfo.isSell === 1"  @click="showSell = true">
        ¥{{pageInfo.sellPrice}}
      </button>
      <button type="button" class="share u-btn" v-else @click="showShare = true"><i class="u-icon-share-community"></i></button>
    </div>
    <span class="money_other">
      分享赚
      <img src="../../assets/icon/bg_share.png" />
    </span>
  </div>
</template>

<style lang="less">
  .share-group {
    position: absolute;
    right: 10px;
    top: 25px;
    line-height: 1;
    font-size: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
    
    z-index: 99;
    .group_wrap {
      overflow: hidden;
      width: 100%;
      height: 100%;
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
      font-size:12px;
      font-family:PingFangSC-Regular;
      color:rgba(53,64,72,1);
      line-height:18px;
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
      font-size: 13px;
      color: @font-color-default;

      &:first-child {
        padding: 8px 12px 6px 15px;
      }

      &:last-child {
        padding: 8px 15px 6px 12px;
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
        width: 1px; /* no */
        height: 18px;
      }

      &.invite,
      &.money {
        background: #ffe266;
        
      }
    }
  }
</style>

<script>
  import index from './main.js'
  export default index
</script>
