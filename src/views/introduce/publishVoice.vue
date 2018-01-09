<template>
  <div class="p-body p-publish-voice">
    <div class="record-container">
      <div class="hd">
        <button type="button" class="u-btn-close" @click="handleClose">关闭</button>
      </div>
      <recorder />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import Recorder from '@/components/recorder'

@Component({
  name: 'publish-voice',
  components: {
    Recorder
  }
})
export default class PublishVoice extends Vue {
  /**
   * 点击关闭
   */
  handleClose () {
    const self = this
    this.$vux.confirm.show({
      content: '确认要关闭并删除已录制的音频？',
      onConfirm () {
        self.$router.go(-1)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.p-publish-voice {
  min-height: 100%;

  .record-container {
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    width: 100%;

    .hd {
      text-align: right;

      .u-btn-close {
        padding: 15px;
        line-height: 19px;
        font-size: 15px;
        font-weight: bold;
        color: #d7ab70;
      }
    }
  }
}
</style>

