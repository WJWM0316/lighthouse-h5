<template>
  <!-- 社区卡片项 （用于首页等卡片项） -->
  <div class="community-info-card" @click.prevent.stop="handleTap">
    <div class="master-info">
      <div class="right" :class="{newMessage}">
        <img :src="community.icon" alt="">
      </div>
      <div class="left">
        <div class="left-info">
          <p class="community-title" v-text="community.title"></p>
          <p class="community-desc" v-text="community.simpleIntro"></p>
        </div>

        <div class="left-desc">
          <div class="community-status-box">
            <div class="community-status">
              <!-- <span v-text="community.master && community.master.realName"></span> -->
              <span v-if="communityStatus && cardType === 'joined'" class="status" :class="communityStatus === '已结束' ? 'end' : ''" v-html="communityStatus"></span>
              <template v-if="cardType === 'picked'">
                  <span v-if="community.joinPrice > 0 && showFreeIdentification" class="price">¥ {{community.joinPrice}}</span>
                  <span v-if="community.joinPrice === 0 && showFreeIdentification" class="price">免费</span>
                  <span v-text="community.master && community.masterIntro" class="job"></span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import "style.less";
</style>

<script>
  import index from './main.js'
  export default index
</script>
