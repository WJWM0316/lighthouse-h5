<template>
  <div class="p-body p-message-outer">
    <scroller @refresh="handleRefresh" @pullup="handlePullup">
      <div class="exchange-wx" @click="goexChangeList">
        <div>交换微信申请</div>
        <div class="red-dot" v-if="isRead"></div>
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
                        @audioEvent="audioEvent"
                        @audioState="audioState"
                        @videoEvent="videoEvent"
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
//        switch (item.type) {
//          case 1: // 回答我的提问
//          case 2: // 回答我的追问
//          case 3: // 评论我的问答
//            wx.navigateTo({
//              url: `/pages/introduce/ask?communityId=${item.LighthouseId}`
//            })
//            break
//          case 4: // 评论我帖子
//            wx.navigateTo({
//              url: `/pages/details/circle?sourceId=${item.beReturnedId}&type=2`
//            })
//            break
//          case 5: // 回复我的评论
//            wx.navigateTo({
//              url: `/pages/details/commentList?commentId=${item.beReturnedId}`
//            })
//            break
//          case 6: // 6评论导师内容（朋友圈）
//            console.log('评论导师内容（朋友圈）')
//            console.log('问题的id', item.beReturnedId, '提问类型', item.type)
//            wx.navigateTo({ // 我是大咖 直接跳转到问答或帖子或朋友圈的详情页
//              url: `/pages/details/circle?sourceId=${item.beReturnedId}&type=1`
//            })
//            break
//        }
      },
      goUserDetail (userId, LighthouseId) {
//        wx.navigateTo({
//          url: `/pages/introduce/details?userId=${userId}&communityId=${LighthouseId}`
//        })
      },
      goCommunityDetail (LighthouseId) {
//        console.log('communityId', LighthouseId)
//        wx.navigateTo({
//          url: `/pages/introduce/community?communityId=${LighthouseId}`
//        })
      },
      /**
       * 音频事件监听
       * @param e
       */
      audioEvent (e) {
//        const {eventType} = e
//        switch (eventType) {
//          case 'canPlay':
//            this.dataList[this.currentAudio.index].musicState = 1
//            break
//          case 'waiting':
//            this.dataList[this.currentAudio.index].musicState = 2
//            break
//          case 'time-update':
//            if (this.dataList[this.currentAudio.index].musicState === 2) {
//              this.dataList[this.currentAudio.index].musicState = 1
//            }
//            this.dataList[this.currentAudio.index].progress = (e.currentTime / e.duration).toFixed(2) * 100
//            break
//          case 'pause':
//            this.dataList[this.currentAudio.index].musicState = 0
//            break
//          case 'end':
//            this.dataList[this.currentAudio.index].progress = 0
//            this.dataList[this.currentAudio.index].musicState = 0
//            break
//        }
      },
      /**
       * 音频状态监听
       * @param audio
       */
      audioState (audio) {
//        const {index, state, that} = audio
//        const self = that || this
//        const {index: currIndex} = self.currentAudio
//        // 如果不是操作 同一段音频
//        if (currIndex && index !== currIndex) {
//          self.dataList[currIndex].musicState = 0 // 播放状态初始
//          self.dataList[currIndex].progress = 0   // 播放进度初始
//        }
//        self.dataList[index].musicState = state
//        self.currentAudio = {
//          index,
//          item: self.dataList[index]
//        }
//        self.$apply()
      },
    }
  })
  export default class ApplyIndex extends Vue {
    isRead = true
    iconSrc = 'http://cdnstatic.zike.com/Uploads/static/beacon/404.png'
    dataList = []

    goexChangeList () {
      this.$router.push({name: 'exchange-list'})
      console.log('goexChangeList')
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
        const {list, total} = await messageListApi(params)
        this.dataList = page === 1 ? (list || []) : this.dataList.concat(list || [])
        this.pagination.page = page
        this.pagination.pageSize = pageSize
        this.pagination.total = total
        this.pagination.end = this.isLastPage
        this.pagination.busy = false
      } catch (e) {
        this.$vux.toast.text(e.message, 'middle')
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
      font-weight: 600;
      margin: 0 15px;
      padding: 15px 0;
      border-bottom: 2px solid #ededed;
    }
    .exchange-wx {
      font-weight: 500;
      margin: 0px 15px;
      padding: 15px 0;
      position: relative;
      .red-dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #ff3434;
        position: absolute;
        right: 22px;
        top: 18px;
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
