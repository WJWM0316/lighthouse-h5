<template>
  <div class="p-body p-publish-voice">
    <div class="record-container">
      <div class="hd">
        <button type="button" class="u-btn-close" @click="handleClose">关闭</button>
      </div>
      <recorder ref="recorder" @uploading="handleUploading" @upload-success="handleUploadSuccess" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import Recorder from '@/components/recorder'

import { publishApi } from '@/api/pages/content'

Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate' // for vue-router 2.2+
  ])

@Component({
  name: 'publish-voice',
  components: {
    Recorder
  }
})
export default class PublishVoice extends Vue {
  form = {
    communityId: '', // 社区id
    fileId: []
  }

  serverIds = []

  //发送成功
  sendOK=false

  //路由离开前
  beforeRouteLeave(to,from,next){
    next()
  }

  created () {
    this.form.communityId = this.$route.params.communityId
  }

  beforeDestroy () {
    this.$refs.recorder.clear()
  }

  /**
   * 发布
   */
  async publish () {
    try {
      const params = {
        communityId: this.form.communityId,
        type: 1,
        fileId: this.form.fileId
      }
      this.$vux.loading.show({
        text: '正在发布...'
      })
      await publishApi(params)
      this.$vux.toast.text('发布成功', 'bottom')

      // let path=`/introduce/${sessionStorage.getItem("nowCommunity")}/community`;
      // this.sendOK=true;
      //   this.$router.replace(path);
      sessionStorage.setItem("isNewLoad",true);  
      sessionStorage.setItem("scrollTop",0);
      sessionStorage.setItem("loadType",1)
      this.$router.go(-1)
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    } finally {
      this.$vux.loading.hide()
    }
  }

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

  /**
   * 文件上传中
   */
  handleUploading () {
    this.$vux.loading.show({
      text: '上传中...'
    })
  }

  /**
   * 文件上传成功
   */
  handleUploadSuccess (files) {
    this.form.fileId = files.map(item => item.fileId)
    this.serverIds = files.map(item => item.mediaId)
    this.publish()
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

