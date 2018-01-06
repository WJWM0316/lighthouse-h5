<template>
  <div class="all-details">

    <!-- header -->
    <div class="header">
      <dynamic :dynamicList="dynamicList"
               :hideCommentBtn="true"
               :hidePraiseBtn="true"
               :hideBorder="true"
               :hideCommentArea="true"
               :disableComment="true"
               :disableContentClick="true"
               :showIdentification="true"
      ></dynamic>
    </div>

    <!-- container -->
    <div class="container">
    </div>

    <!-- footer -->
    <div class="footer">
      <div class="page-operation">
        <!-- 点赞按钮 -->
        <button>
          <img v-if="item.isFavor" class="icon-zan" src="./../../assets/icon/zan_click.png" />
          <img v-else class="icon-zan" src="./../../assets/icon/zan2@3x.png" />
          {{item.favorTotal > 0 ? item.favorTotal : '点赞'}}
        </button>
        <span class="split"></span>
        <!-- 评论按钮 -->
        <button>
          <img class="icon-pinglun" src="./../../assets/icon/pinglun2@3x.png" />
          {{'评论'}}
        </button>
      </div>
    </div>

    <!--<div class="ask-box {{isShowPumpBtn ? 'show' : ''}}">-->
      <!--<div class="user-input">-->
        <!--<input type="text" placeholder="{{placeholderText}}"-->
               <!--bindblur="sleep"-->
               <!--@confirm="sendComment"-->
               <!--focus="{{isPumpFocus}}"-->
               <!--bindinput="bindInputPump"-->
               <!--value="{{pumpContent}}"-->
               <!--maxlength="1000"-->
               <!--placeholder-style="color: #bcbcbc"-->
               <!--cursor-spacing="20" />-->
      <!--</div>-->
      <!--<text class="ask-btn" @tap="sendComment">发送</text>-->
    <!--</div>-->

  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamic from '@/components/dynamic/dynamic'
  import { getCircleDetailApi, getPostDetailApi, getProblemDetailApi, getCommentListApi, setFavorApi, setSubmitCommentApi, delCommontApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'all-details',
    components: {
      dynamic
    },
    computed: {
      item () {
        return this.dynamicList[0] || {}
      }
    }
  })
  export default class introduce extends Vue {
    dynamicList = []
    isShowPumpBtn = false

    async created () {
      await this.pageInit()
    }

    async pageInit () {
      const { sourceId, type } = this.$route.params
      let res = ''
      if (type === '1') {
        res = await this.getCircleDetailApi(sourceId)
      } else if (type === '2') {
        res = await this.getPostDetailApi(sourceId)
      } else {
        res = await this.getProblemDetailApi(sourceId)
      }
      this.dynamicList = [res]
    }

    // ------------------------------------------------
    /**
     * 朋友圈详情
     **/
    getCircleDetailApi (circleId) {
      return getCircleDetailApi({
        circleId
      })
    }
    /**
     * 帖子详情
     **/
    getPostDetailApi (circleId) {
      return getPostDetailApi({
        circleId
      })
    }
    /**
     * 问题详情
     **/
    getProblemDetailApi (problemId) {
      return getProblemDetailApi({
        problemId
      })
    }
    // ------------------------------------------------
  }
</script>

<style lang="less" scoped>
  .all-details {
  }
</style>
