<template>
  <div class="p-share-lite p-body">
    <div class="main">
      <image-item class="image-item" :src="communityImage" mode="auto" @loaded="handleImageLoaded" @error="handleImageError" />
    </div>

    <div class="btn-container">
      <button type="button" class="friends u-btn" @click="handleShare">分享给朋友</button>
      <button type="button" class="circles u-btn" @click="handleShare">分享到朋友圈</button>
    </div>

    <share-dialog :is-show="shareDialog.show" @close-share="shareDialog.show = false"></share-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ShareDialog from '@/components/shareDialog/ShareDialog'

import { getMyCommunityImageApi } from '@/api/pages/center'

@Component({
  name: 'share-lite',
  components: {
    ShareDialog
  }
})
export default class CenterShareLite extends Vue {
  communityId = '' // 社区id
  communityImage = '' // 分享图片
  shareDialog = {
    show: false
  }

  created () {
    this.communityId = this.$route.params.communityId
    this.init()
  }

  /**
   * 初始化页面数据
   */
  async init () {
    try {
      this.$vux.loading.show({
        text: '加载中...'
      })
      const params = {
        communityId: this.communityId,
        globalLoading: false
      }
      const { communityImage } = await getMyCommunityImageApi(params)
      this.communityImage = communityImage
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
      this.$vux.loading.hide()
    }
  }

  /**
   * 点击分享给朋友/朋友圈
   */
  handleShare () {
    this.shareDialog.show = true
  }

  /**
   * 图片加载完成
   */
  handleImageLoaded () {
    this.$vux.loading.hide()
  }

  /**
   * 图片加载失败
   */
  handleImageError () {
    this.$vux.loading.hide()
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-share-lite {
  background: rgba(0, 0, 0, .7);

  .main {
    padding-top: 18px;
    text-align: center;

    .image-item {
      background: #fff;
      width: 325px;
      height: 498px;
      line-height: 498px;
      border-radius: 10px;
    }
  }

  .btn-container {
    .setFlex();
    justify-content: space-between;
    align-content: center;
    padding: 18px 25px;
    // line-height: 1;
    font-size: 0;

    .u-btn {
      flex: 0 0 auto;
      box-sizing: border-box;
      padding: 11px 22px 9px;
      background: #666;
      min-width: 120px;
      line-height: 24px;
      border-radius: 22px;
      box-shadow: 0 10px 15px rgba(0, 0, 0, .05);
      font-size: 15px;
      color: #fff;

      &.circles {
        background: #ffe266;
        min-width: 190px;
        color: @font-color-default;
      }
    }
  }
}
</style>
