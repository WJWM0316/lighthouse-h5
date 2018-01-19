<template>

  <!-- 大咖精选页 (社区页) -->
  <div :class="{'big-shot-community': true, author: isAuthor}">

    <!-- tab -->
    <div :class="{'big-shot-community-title': true, 'circles': showType, 'forum': !showType, 'fixed': true}" v-if="isCommunityTitleFixed">
      <span @click="toggle(1)">导师内容</span>
      <span @click="toggle(0)">学员交流</span>
    </div>

    <scroll @refresh="handleRefresh" @pullup="handlePullup" @scroll="scroll">
      <!-- header -->
      <div class="header">
        <community-card class="community-item" :community="pageInfo" :type="2">
          <!--<a class="addon-text" slot="cover-addon">-->
            <!--介绍 <img class="icon" src="../../assets/icon/icon_angle_right_white.png" />-->
          <!--</a>-->
        </community-card>
        <div class="share-btn" @click="showShare = true">
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
        <div class="fixed-box" ref="community-title">
          <div :class="{'big-shot-community-title': true, 'circles': showType, 'forum': !showType}" v-if="!isCommunityTitleFixed">
            <span @click="toggle(1)">导师内容</span>
            <span @click="toggle(0)">学员交流</span>
          </div>
        </div>
        <div class="big-shot-community-content">
          <div class="module-content" v-if="dynamicList.length > 0">
            <dynamic :dynamicList="dynamicList"
                     :showDelBtn="true"
                     :showIdentification="showIdentification"
                     :disableOperationArr="disableOperationArr"
                     @disableOperationEvents="operation"
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
    <!--分享弹窗-->
    <share-dialog :isShow="showShare" @close-share="showShare = false"
                  :shareType="1"></share-dialog>
    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      @send="sendComment"
    ></suspension-input>

    <actionsheet v-model="releaseActionsheet.show" :menus="releaseActionsheet.menus" :close-on-clicking-mask="false" show-cancel @on-click-menu="handleReleaseActionsheetItem" />
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Actionsheet } from 'vux'
  import dynamic from '@/components/dynamic/dynamic'
  import CommunityCard from '@/components/communityCard'
  import suspensionInput from '@/components/suspensionInput/suspensionInput'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import wxUtil from '@/util/wx/index'
  import { getCirclesApi, getCommunityApi, getCommunicationsApi, setSubmitCommentApi } from '@/api/pages/pageInfo'
  import WechatMixin from '@/mixins/wechat'
  import ShareDialog from '@/components/shareDialog/ShareDialog'

  @Component({
    name: 'big-shot-community',
    components: {
      dynamic,
      CommunityCard,
      suspensionInput,
      Scroll,
      Actionsheet,
      ShareDialog
    },
    computed: {
      isAuthor () {
        return this.pageInfo.isAuthor
      }
    },
    mixins: [ListMixin, WechatMixin]
  })
  export default class community extends Vue {
    showShare = false // 显示分享弹框
    pageInfo = {}
    dynamicList = []
    discussItemList = []
    showType = 1 // 1 朋友圈 0 交流社区
    isCommunityTitleFixed = false
    showIdentification = false
    communityTitleTop = 0
    disableOperationArr = ['comment']

    commentIndex = -1
    suspensionInputPlaceholder = '写评论'
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
      if (this.$route.query.type !== undefined) {
        this.showType = parseInt(this.$route.query.type)
      }
      console.log('this.showType', this.showType)
      wxUtil.reloadPage()
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
          'link': location.origin + `/beaconweb/#/introduce/${communityId}/community`
        })
      })
    }

    async pageInit () {
      const { communityId } = this.$route.params
      this.pagination.end = false // 初始化数据，必定不是最后一页
      let res = await this.getCommunity(communityId)
      this.pageInfo = res
      await this.getList({page: 1})

      this.$nextTick(() => {
        this.communityTitleTop = this.$refs['community-title'].offsetTop
        console.log(this.$refs)
        console.log(this.$refs['community-title'].offsetTop)
      })
    }

    toggle (type) {
      if (this.showType !== type) {
        this.displaySuspensionInput = false
        this.dynamicList = []
        this.showType = type
        this.$router.replace(`/introduce/${this.$route.params.communityId}/community?type=${type}`)
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
        this.$router.push(`/publish/${this.$route.params.communityId}?type=0`)
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

    /**
     * 操作事件
     * @param e :{eventType, itemIndex} eventType: 事件名称 itemIndex: 触发对象下标
     */
    operation (e) {
      const {eventType, itemIndex} = e

      const item = this.dynamicList[itemIndex]

      switch (eventType) {
        case 'comment':
          this.comment({item, itemIndex}).then()
          break
      }
    }

    /**
     * 评论
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async comment ({item, itemIndex}) {
      if (item.modelType !== 'circle') {
        this.suspensionInputPlaceholder = '回复' + item.releaseUser.realName + ':'
      }
      this.displaySuspensionInput = true
      this.commentIndex = itemIndex
    }

    /**
     * 发送评论
     * @param data
     */
    async sendComment ({value, commentIndex}) {
      const item = this.dynamicList[commentIndex]
      const {problemId, circleId} = item
      let sourceType = 4
      switch (item.modelType) {
        case 'circle':
          sourceType = 1
          break
        case 'post':
          sourceType = 2
          break
        case 'problem':
          sourceType = 3
          break
      }

      const params = {
        sourceId: circleId || problemId,     // 对应评论类型id
        sourceType,   // 评论类型：1.朋友圈；2.帖子；3.提问;4.子评论
        content: value       // 评论内容
      }

      const res = await setSubmitCommentApi(params)

      if (this.dynamicList[commentIndex] && this.dynamicList[commentIndex].comments) {
        this.dynamicList[commentIndex].comments.splice(0, 0, res) // 评价列表已经存在加在尾部
        this.dynamicList[commentIndex].commentTotal += 1
      } else {
        this.dynamicList[commentIndex]['comments'] = [res] // 不存在加一个对象
        this.dynamicList[commentIndex].commentTotal = 1
      }
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

    scroll (e) {
      const communityTitleTop = this.communityTitleTop
      console.log(e, communityTitleTop)
      if (communityTitleTop) {
        const {scrollTop} = e.target
        this.isCommunityTitleFixed = scrollTop >= communityTitleTop
      }
    }
  }
</script>
<style lang="less" scoped type="text/less">
  @import "../../styles/mixins";
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
          margin-left: 5px;
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
        height: 3px;
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

    & .container {
      font-size: 15px;

      & .classmate-list {
        margin: 20px 15px 0 15px;
        border-top: solid 1px #dcdcdc; /* no */
        border-bottom: solid 1px #dcdcdc; /* no */
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
            font-size: 15px;
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
          border: solid 1px #ededed; /* no */
        }
        & img:first-of-type, & img:nth-of-type(14n + 1) {
          margin-left: 0;
        }
      }

      & .fixed-box {
        height: 40px;
        margin-top: 35px;
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
          .setTag();
          min-width: 13px;
          height: 13px;
          line-height: 13px;
          padding: 0 3px;
          transform: translate(100%, -50%);
          position: absolute;
          right: 3px;
          top: 3px;
          font-size: 10px;
          /*background-color: #ff4949;*/
          /*border-radius: 50%;*/
          /*line-height: 1;*/
          /*display: inline-block;*/
          font-style: normal;
          /*color: #FFF;*/
          /*padding: 2px 3px;*/
        }
      }
      & button:last-of-type {
        background-color: #ffe266;
        color: #354048;
      }
    }
  }
</style>
