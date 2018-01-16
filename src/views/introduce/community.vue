<template>

  <!-- 大咖精选页 (社区页) -->
  <div :class="{'big-shot-community': true, author: isAuthor}">
    <scroll @refresh="handleRefresh" @pullup="handlePullup">
      <!-- header -->
      <div class="header">
        <community-card class="community-item" :community="pageInfo" :type="2">
          <!--<a class="addon-text" slot="cover-addon">-->
            <!--介绍 <img class="icon" src="../../assets/icon/icon_angle_right_white.png" />-->
          <!--</a>-->
        </community-card>
        <div class="share-btn">
          <img class="share-icon" src="./../../assets/icon/icon_share.png" />
          <span>分享</span>
        </div>
      </div>

      <!-- container -->
      <div class="container">

        <!-- 同学的列表 -->
        <div class="classmate-list" v-if="pageInfo.peoples && pageInfo.peoples.length > 0" @click="toMemberList">
          <div class="flex-1">
            <img :src="item['avatar']" v-for="(item, index) in pageInfo['peoples']" v-if="index < 6" />
            <img src="./../../assets/icon/firends-call-more.png" v-else-if="pageInfo.remainingJoinNum > 7" />
            <img :src="item['avatar']" v-else />
          </div>
          <div class="people-count">
            <img class="icon" src="./../../assets/icon/member.png" />
            <span>{{pageInfo['joinedNum']}}</span>
            <img class="icon" src="./../../assets/icon/mypage_arrow.png" />
          </div>
        </div>

        <!-- 主体内容块 -->
        <div class="fixed-box">
          <div :class="{'big-shot-community-title': true, 'circles': showType, 'forum': !showType, 'fixed': isCommunityTitleFixed}">
            <span @click="toggle(1)">导师内容</span>
            <span @click="toggle(0)">学员交流</span>
          </div>
        </div>
        <div class="big-shot-community-content">
          <div class="module-content" v-if="dynamicList.length > 0">
            <dynamic :dynamicList="dynamicList"
                     :showDelBtn="true"
                     :showIdentification="showIdentification"
                     @suspensionInputState="suspensionInputState"
            ></dynamic>
          </div>
          <div class="blank" v-else>
            <img src="http://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/Uploads/static/picture/2017-12-14/20171214171938.png" />
            <p>暂时没有内容～</p>
          </div>
        </div>

      </div>
    </scroll>

    <!-- footer -->
    <div class="footer" v-show="!displaySuspensionInput">
      <div v-if="isAuthor" class="author-operation">
        <button @click="question">
          <span class="desc">回答问题<i class="answer-count" v-if="pageInfo['answerTotal'] > 0">{{pageInfo['answerTotal']}}</i></span>
        </button>
        <button @click="release">发布动态</button>
      </div>
      <div class="ask-btn" @click="askBtnClick" v-else>
        <img src="./../../assets/icon/icon_question.png" v-if="showType" />
        <img src="./../../assets/icon/icon_writing.png" v-else />
        <span style="margin-top: 10px;">{{showType ? '提问' : '发帖'}}</span>
      </div>
    </div>

    <actionsheet v-model="releaseActionsheet.show" :menus="releaseActionsheet.menus" :close-on-clicking-mask="false" show-cancel @on-click-menu="handleReleaseActionsheetItem" />
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Actionsheet } from 'vux'
  import dynamic from '@/components/dynamic/dynamic'
  import CommunityCard from '@/components/communityCard'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { getCirclesApi, getCommunityApi, getCommunicationsApi, setSubmitCommentApi } from '@/api/pages/pageInfo'
  import WechatMixin from '@/mixins/wechat'

  @Component({
    name: 'big-shot-community',
    components: {
      dynamic,
      CommunityCard,
      Scroll,
      Actionsheet
    },
    computed: {
      isAuthor () {
        return this.pageInfo.isAuthor
      }
    },
    mixins: [ListMixin, WechatMixin]
  })
  export default class community extends Vue {
    pageInfo = {}
    dynamicList = []
    discussItemList = []
    showType = 1 // 1 朋友圈 0 交流社区
    isCommunityTitleFixed = false
    showIdentification = false
    displaySuspensionInput = false

    // 发布操作选项
    releaseActionsheet = {
      show: false,
      menus: [
        {
          label: '动态',
          value: 'default'
        },
        {
          label: '语音',
          value: 'voice'
        }
      ]
    }

    created () {
      this.pageInit().then(() => {
        const {title, simpleIntro, master, shareImg, communityId} = this.pageInfo
        const {realName, career} = master
        const str = realName ? realName + (career ? '|' + career : '') : ''
        // 页面分享信息
        this.wechatShare({
          'titles': str + '|' + title,
          'title': str + '|' + title,
          'desc': simpleIntro,
          'imgUrl': shareImg,
          'link': location.origin + `/introduce/${communityId}/community`
        })
      })
    }

    operation (e) {
      const {eventType, itemIndex} = e
      const item = this.discussItemList[itemIndex]
      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          break
        case 'praise':
          break
        case 'del':
          // :todo 删除请求
//          this.discussItemList.splice(itemIndex, 1)
//          console.log(this.discussItemList, itemIndex)
          break
      }
    }

    async pageInit () {
      const { communityId } = this.$route.params
      this.pagination.end = false // 初始化数据，必定不是最后一页
      let res = await this.getCommunity(communityId)
      this.pageInfo = res
      await this.getList({page: 1})
    }

    toggle (type) {
      if (this.showType !== type) {
        this.showType = type

        this.showIdentification = !type

        this.pagination.end = false // 初始化数据，必定不是最后一页
        this.getList({page: 1}).then(() => {})
      }
    }
    askBtnClick () {
      if (this.showType) {
        // :todo 提问
        this.$router.push(`/introduce/ask/${this.$route.params.communityId}`)
      } else {
        // :todo 发帖
        this.$router.push(`/publish/${this.$route.params.communityId}`)
      }
    }
    question () {
      // :todo 回答问题
      this.$router.push(`/introduce/questions/${this.$route.params.communityId}`)
    }
    release () {
      // :todo 发布
      this.releaseActionsheet.show = true
    }
    toMemberList () {
      this.$router.push({name: 'classmates', communityId: this.$route.params.communityId})
    }
    suspensionInputState (val) {
      this.displaySuspensionInput = val
    }

    // ------------------------------------------------
    /**
     * 获取社区基本信息
     **/
    getCommunity (communityId) {
      return getCommunityApi({
        communityId
      })
    }
    /**
     * 获取朋友圈列表
     **/
    getCirclesList (params) {
      return getCirclesApi(params)
    }
    /**
     * 获取交流社区列表
     **/
    getCommunicationsList (params) {
      return getCommunicationsApi(params)
    }
    // ------------------------------------------------

    async getList ({page, pageSize} = {}) {
      if (this.pagination.busy) {
        // 防止多次加载
        return
      }
      if (this.pagination.end) {
        this.$vux.toast.text('没有更多数据了', 'bottom')
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      const params = {
        communityId: this.$route.params.communityId,
        page: page,
        pageCount: pageSize
      }

      this.pagination.busy = true
      let res = ''
      if (this.showType) {
        res = await this.getCirclesList(params)
      } else {
        res = await this.getCommunicationsList(params)
      }
      const {circles, lists, total} = res

      const temp = new Array(...(this.showType ? circles : lists))
      temp.forEach((item) => {
        if (item['modelType'] === 'problem') {
          item['answers'].forEach((answer) => {
            answer.musicState = 0
            answer.progress = 0
          })
        } else if (item['circleType'] === 1) {
          item.musicState = 0
          item.progress = 0
        } else if (item['circleType'] === 2) {
          console.log('视频')
          item.videoPlay = false
        }
      })

      console.log(temp)
      if (page === 1) {
        this.dynamicList = temp
      } else {
        this.dynamicList = this.dynamicList.concat(temp || [])
      }

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = total
      this.pagination.end = this.isLastPage
      this.pagination.busy = false
    }

    /**
     * 加载下一页
     */
    async loadNext() {
      const nextPage = this.pagination.page + 1
      await this.getList({ page: nextPage })
    }

    /**
     * 下拉刷新
     */
    handleRefresh (loaded) {
      this.pageInit().then(res => {
        loaded('done')
      })
    }

    /**
     * 上拉加载
     */
    handlePullup (loaded) {
      this.loadNext().then(() => { loaded('done') })
    }

    /**
     * 点击发布选项item
     * @param {*} key
     * @param {*} item
     */
    handleReleaseActionsheetItem (key, item) {
      switch (key) {
        case 'default':
          this.$router.push(`/publish/${this.pageInfo.communityId}`)
          break
        case 'voice':
          this.$router.push(`/publishVoice/${this.pageInfo.communityId}`)
          break
        default:
          break
      }
    }
  }
</script>
<style lang="less" scoped>
  .big-shot-community {
    box-sizing: border-box;
    height: 100%;
    &.author {
      padding-bottom: 50px;
    }

    & .header {
      position: relative;

      & button {
        padding-right: 0;

      }

      & .share-btn {
        position: absolute;
        top: 15px;
        right: 0;
        width: 70px;
        height: 32px;
        border-radius: 50px 0 0 50px;
        background-color: rgba(255, 255, 255, .8);
        font-size: 15px;
        line-height: 32px;
        color: #d7ab70;
        display: flex;
        align-items: center;
        justify-content: center;

        & .share-icon {
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }

        &::after {
          content: none;
        }
      }

      .community-item {
        .cover-container .master .career {
          padding-right: 50px;
        }

        .addon-text {
          position: absolute;
          right: 5px;;
          bottom: 10px;
          padding: 0 10px;
          background: none;
          line-height: 28px;
          font-size: 13px;
          color: rgba(255, 255, 255, .8);

          &:active {
            background: none;
            color: #fff;
          }

          .icon {
            position: relative;
            top: -1px;
            width: 16px;
            height: 16px;
            vertical-align: middle;
          }
        }
      }
    }

    & .container {
      font-size: 15px;

      & .classmate-list {
        margin: 20px 15px 0 15px;
        border-top: solid 1px #dcdcdc;
        border-bottom: solid 1px #dcdcdc;
        padding: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        height: 30px;
        color: #929292;
        font-size: 12px;

        & .people-count {
          display: flex;
          justify-content: space-between;
          align-items: center;

          & span {
            padding: 0 14px;
          }
          & .icon {
            width: 16px;
            height: 16px;
            border-style: none;
            border-radius: 0;
            margin-left: 0;
          }
        }

        & img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-left: -5px;
          border: solid 1px #ededed;
        }
        & img:first-of-type, & img:nth-of-type(14n + 1) {
          margin-left: 0;
        }
      }

      & .fixed-box {
        height: 40px;
        margin-top: 35px;
      }
      & .big-shot-community-title {
        padding: 0 15px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #929292;

        & span {
          height: 40px;
          line-height: 40px;
        }
        &.circles span:first-of-type,
        &.forum span:last-of-type {
          color: #354048;
          font-weight: 500;
          position: relative;
        }
        &.circles span:first-of-type:after,
        &.forum span:last-of-type:after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 4px;
          border-radius: 2px;
          background-color: #ffe266;
        }

        &.fixed {
          position:fixed;
          top:0;
          left:0;
          right:0;
          background:#fff;
          margin-top: 0;
          z-index: 99;
        }
      }

      & .big-shot-community-content {

        & .blank {
          padding: 50px 0;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;

          font-size: 13px;
          color: #bcbcbc;

          & img {
            width: 130px;
            height: 130px;
          }
          & p {
            margin-top: 20px;
          }
        }
      }
    }

    & .footer .ask-btn {
      position: fixed;
      right: 20px;
      bottom: 30px;
      width: 65px;
      height: 65px;
      background-color: #ffffff;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
      border-radius: 50%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      color: #d7ab70;

      & img {
        width: 26px;
        height: 25px;
        margin-top: 4px;
      }
    }

    & .footer .author-operation {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;

      & button {
        flex-grow: 1;
        background-color: #ffffff;
        border-radius: 0;
        height: 50px;
        line-height: 50px;
        color: #666666;
        font-size: 16px;
        border-style: none;
        & .desc {
          position: relative;
        }
        & .answer-count {
          position: absolute;
          right: 3px;
          top: 3px;
          font-size: 10px;
          background-color: #ff4949;
          transform: translate(100%, -50%);
          border-radius: 50%;
          line-height: 1;
          display: inline-block;
          font-style: normal;
          color: #FFF;
          padding: 2px 3px;
        }
      }
      & button:last-of-type {
        background-color: #ffe266;
        color: #354048;
      }
    }
  }
</style>
