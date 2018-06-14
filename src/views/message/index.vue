<template>
  <div class="p-body p-message-outer">
    <scroller @refresh="handleRefresh" @pullup="handlePullup">
      <div class="exchange-wx" @click="goexChangeList">
        <span class="fs15">交换微信申请</span>
        <div class="red-dot" v-if="!isRead"></div>
        <img class="icon" style="margin-left: 10px;" src="./../../assets/icon/mypage_arrow.png">
      </div>
      <div class="space-line"></div>
      <div class="message-pannel fs15" v-if="dataList.length > 0">通知列表</div>
      <div class="message-container">
        <div v-for='(item,index) in dataList'>
          <message-item class='community-item'
                        :item.sync='item'
                        :itemIndex="index"
                        @tap-one='goDetail'
                        @tap-two='goUserDetail'
                        @tap-three='goCommunityDetail'
                        @tap-four='handleDetails'
          ></message-item>
        </div>
      </div>
      <div class="p-message" v-if="dataList.length === 0">
        <div class="icon-container">
          <img class="icon" :src="iconSrc">
        </div>
        <div class="text">暂时还没有消息哦～</div>
      </div>
    </scroller>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import ListMixin from '@/mixins/list'
  import Scroller from '@/components/scroller'
  import messageItem from '@/components/messageItem/messageItem'
  import { XInput, XButton } from 'vux'
  import { messageListApi } from '@/api/pages/message'

  @Component({
    name: 'login-index',
    components: {
      Scroller,
      XInput,
      XButton,
      messageItem
    },
    mixins: [ListMixin],
    methods: {
      videoEvent () {},
      handleDetails () {},
      goDetail (item) {
        console.log('item', item.type)
        switch (item.type) {
          case 1: // 回答我的提问
          case 2: // 回答我的追问
          case 3: // 评论我的问答
            this.$router.push(`/details/${item.beReturnedId}/3`)
            break
          case 4: // 评论我帖子
            this.$router.push(`/details/${item.beReturnedId}/2`)
            break
          case 5: // 回复我的评论
            this.$router.push(`/reply/${item.beReturnedId}`)
            break
          case 6: // 6评论导师内容（朋友圈）
            this.$router.push(`/details/${item.beReturnedId}/1`)
            break
        }
      },
      goCommunityDetail (LighthouseId) {
        this.$router.push({name: 'community', params: {communityId: LighthouseId}})
      },
      /**
       * 音频状态监听
       * @param audio
       */
    }
  })
  export default class ApplyIndex extends Vue {
    currentPlay = {
      itemIndex: -1,
      problemIndex: -1
    }
    music = ''
    isRead = false
    iconSrc = 'http://cdnstatic.zike.com/Uploads/static/beacon/404.png'
    dataList = []

    goexChangeList () {
      this.$router.push({name: 'exchange-list'})
    }

    goUserDetail (userId, communityId) {
      this.$router.push({name: 'userInfo-details', params: {userId}, query: {communityId}})
    }

    async getList ({page, pageSize} = {}) { // 请求列表
      if (this.pagination.end || this.pagination.busy) {
        // 防止多次加载
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      if (this.isLastPage && page !== 1) return
      const params = {
        page: page,
        pageCount: pageSize
      }
      this.pagination.busy = true
      try {
        const {list = [], total, isRead} = await messageListApi(params)
        this.isRead = isRead
        const temp = new Array(...list)
        temp.forEach((item) => {
          if (item['contentType'] === 2) {
            item.musicState = 0
            item.progress = 0
          }
        })
        this.dataList = page === 1 ? (list || []) : this.dataList.concat(list || [])
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = total
        this.pagination.end = this.isLastPage
        this.pagination.busy = false
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
    }

    /**
     * 下拉刷新
     */
    async handleRefresh (loaded) {
      await this.getList({page: 1})
      loaded('done')
    }

    /**
     * 上拉加载
     */
    async handlePullup (loaded) {
      const nextPage = this.pagination.page + 1
      await this.getList({page: nextPage})
      loaded('done')
    }

    created () {
      this.getList()
    }

  }
</script>


<style lang="less" type="text/less">
  .p-message-outer {
    padding-bottom: 50px;
    .space-line {
      width: 100%;
      height: 10px;
      background: #f8f8f8;
    }
    .message-pannel {
      background: #fff;
      font-weight: 700;
      margin: 0 15px;
      padding: 15px 0;
      border-bottom: 1px solid #ededed; /* no */
    }
    .exchange-wx {
      font-weight: 700;
      margin: 0px 15px;
      position: relative;
      height: 49px;
      line-height: 49px;
      .red-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ff3434;
        position: absolute;
        right: 22px;
        top: 22px;
      }
      .icon {
        width: 17px;
        height: 17px;
        border-style: none;
        position: absolute;
        right: 0;
        top: 18px;
      }
    }

    .message-container {
    }
    .p-message {
      padding: 120px 15px 50px;
      text-align: center;
      .icon-container {
        margin-bottom: 18px;

        .icon {
          width: 130px;
          height: 130px;
        }
      }
      .text {
        line-height: 21px;
        font-size: 15px;
        color: #bcbcbc;
      }
    }

  }
</style>
