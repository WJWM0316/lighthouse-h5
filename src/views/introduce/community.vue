<template>

  <!-- 大咖精选页 (社区页) -->
  <div class="big-shot-community">
    <scroll @refresh="handleRefresh" @pullup="handlePullup">
      <!-- header -->
      <div class="header">
        <community-card class="community-item" :community="pageInfo" :type="2">
          <!--<a class="addon-text" slot="cover-addon">-->
            <!--介绍 <img class="icon" src="../../assets/icon/icon_angle_right_white.png" />-->
          <!--</a>-->
        </community-card>
        <!--<button class="share-btn">-->
          <!--<img class="share-icon" src="./../../assets/icon/icon_share.png" />分享-->
        <!--</button>-->
      </div>
      
      <!-- container -->
      <div class="container">

        <!-- 同学的列表 -->
        <div class="classmate-list" v-if="pageInfo.peoples && pageInfo.peoples.length > 0">
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
            ></dynamic>
          </div>
          <!--<div class='u-bottom-loading'>-->
            <!--<img class='icon' src='../../static/icon/icon_loading.gif' wx:if='{{!pagination.end}}'></img>-->
            <!--<text class='text' wx:else>没有更多内容了～</text>-->
          <!--</div>-->
          <div class="blank" v-else>
            <img src="http://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/Uploads/static/picture/2017-12-14/20171214171938.png" />
            <p>暂时没有内容～</p>
          </div>
        </div>

      </div>

      <!-- footer -->
      <div :class="{footer: true, author: isAuthor}">
        <div v-if="isAuthor" class="author-operation">
          <button>
            <span class="desc">回答问题<i class="answer-count" v-if="pageInfo['answerTotal'] > 0">{{pageInfo['answerTotal']}}</i></span>
          </button>
          <button>发布动态</button>
        </div>
        <div class="ask-btn" v-else>
          <img v-if="showType" src="./../../assets/icon/icon_question.png" />
          <img v-else src="./../../assets/icon/icon_writing.png" />
          <span style="margin-top: 10px;">{{showType ? '提问' : '发帖'}}</span>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamic from '@/components/dynamic/dynamic'
  import CommunityCard from '@/components/communityCard'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { Confirm } from 'vux'
  import { getCirclesApi, getCommunityApi, getCommunicationsApi, setSubmitCommentApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'big-shot-community',
    components: {
      dynamic,
      CommunityCard,
      Scroll,
      Confirm
    },
    computed: {
      isAuthor () {
        return this.pageInfo.isAuthor
      }
    },
    mixins: [ListMixin]
  })
  export default class community extends Vue {
    pageInfo = {}
    dynamicList = []
    discussItemList = []
    showType = 1 // 1 朋友圈 0 交流社区
    isShowPumpBtn = false
    isCommunityTitleFixed = false
    showIdentification = false

    created () {
      this.pageInit().then(() => {})
    }

    operation (e) {
      const {eventType, itemIndex} = e
      const item = this.discussItemList[itemIndex]
      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          break
        case 'praise':
          let params = ''
          let favor = 0
          if (item) {
            const {commentId: favorId, isFavor} = item
            let favorType = 6
            favor = isFavor ? 0 : 1
            params = {
              favorId,    // 喜爱的id
              favorType,  // 喜爱类型：4问答；5帖子；6评论;7朋友圈；
              isFavor: favor     // 是否喜欢：0取消喜欢，1喜欢
            }
          } else {
            favor = this.dynamicList[0].isFavor ? 0 : 1
            let favorType = 0
            switch (this.$route.params.type) {
              case '1':
                favorType = 7
                break
              case '2':
                favorType = 5
                break
              case '3':
                favorType = 4
                break
            }
            params = {
              favorId: this.$route.params.sourceId,    // 喜爱的id
              favorType,  // 喜爱类型：4问答；5帖子；6评论;7朋友圈；
              isFavor: favor     // 是否喜欢：0取消喜欢，1喜欢
            }
          }
          setFavorApi(params).then(res => {
            console.log(item)
            if (item) {
              this.discussItemList[itemIndex].isFavor = favor
              this.discussItemList[itemIndex].favorTotal += favor ? 1 : -1
              if (favor) {
                this.discussItemList[itemIndex].favors.splice(0, 0, res)
              } else {
                let temp = ''
                this.discussItemList[itemIndex].favors.forEach((item, index) => {
                  if (item.userId === res.userId) {
                    temp = index
                  }
                })
                this.discussItemList[itemIndex].favors.splice(temp, 1)
              }
            } else {
              this.dynamicList[0].isFavor = favor
              this.dynamicList[0].favorTotal += favor ? 1 : -1
              console.log(this.dynamicList[0])
            }
          }).catch(e => {
//            this.$broadcast('show-message', {content: e.message})
          })
          break
        case 'del':
          // :todo 删除请求
//          this.discussItemList.splice(itemIndex, 1)
//          console.log(this.discussItemList, itemIndex)
          const _this = this
          this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {
              console.log(this) // 非当前 vm
              console.log(_this) // 当前 vm
            },
            onConfirm () {}
          })
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
        console.log('没有更多数据了')
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

      if (page === 1) {
        this.dynamicList = this.showType ? circles : lists
      } else {
        this.dynamicList = this.dynamicList.concat((this.showType ? circles : lists) || [])
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
  }
</script>
<style lang="less" scoped>
  .big-shot-community {
    height: 100%;
    padding-bottom: 52px;

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

        & .share-icon {
          width: 15px;
          height: 15px;
          margin-right: 5px;
          transform:translate(0, 2px);
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
        & .desc {
          position: relative;
        }
        & .answer-count {
          position: absolute;
          right: 3px;
          top: 3px;
          font-size: 10px;
          transform: translate(100%, -50%);
        }
      }
      & button:after {
        border-style: none;
      }
      & button:last-of-type {
        background-color: #ffe266;
        color: #354048;
      }
    }
  }
</style>
