<template>
  <!-- 社区卡片项 （用于首页等卡片项） -->
  <div class="community-info-card" @click.prevent.stop="handleTap">
    <div class="master-info">

      <div class="left">

        <div class="left-info">
          <p class="community-title" v-text="community.title"></p>
          <p class="community-desc" v-text="community.simpleIntro"></p>
        </div>

        <div>
          <div class="community-status">
            <span v-text="community.master && community.master.realName"></span>
            <span :class="communityStatus === '招募中' ? '' : 'end'" v-text="communityStatus"></span>
          </div>
          <p v-text="community.master && community.master.career"></p>
        </div>

      </div>

      <div class="right" :class="{newMessage}">
        <img :src="community.detailImg" alt="">
      </div>

    </div>

    <!-- 额外内容区 -->
    <div class="additional">
      <!-- 已结束 -->
      <p v-if="isEnd">社区已结束</p>
      <!-- 未开社 -->
      <p v-else-if="duration"><span style="color: #d7ab70;">{{duration | duration}}</span>后开启</p>
      <!-- 已开社 -->
      <p v-else>社区已开启</p>
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
