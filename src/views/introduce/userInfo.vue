<template>

  <!-- 用户个人详情 (社区页) -->
  <div class="userInfo-details">
    <scroll :pullupable="false" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup"
            :is-none-data="pagination.end">

      <!-- header -->
      <div class="header">
        <div class="userInfo">
          <div class="userInfo-img">
            <img :src="userInfo.avatarUrl"/>
            <img class="sex" v-if="userInfo.gender === 1" src="./../../assets/icon/icon_boy.png"/>
            <img class="sex" v-if="userInfo.gender === 2" src="./../../assets/icon/icon_girl.png"/>
          </div>
          <div class="userInfo-desc">
            <p>{{userInfo.realName}}</p>
            <p v-if="userIdentify === 1">{{userInfo.career}}</p>
            <p v-else>{{userCareer}}</p>
            <p v-if="userIdentify === 1 && userInfo.weChat">微信号：{{userInfo.weChat}}</p>
          </div>
        </div>
        <button class="exchange-btn" v-if="!isShowExchangeBtn" @click="goExchange">交换微信</button>
      </div>

      <!-- container -->
      <div class="container">

        <!-- 大咖 -->
        <!--<block wx:if="{{userIdentify === 1}}">-->
        <div v-if="communityList.length > 0">
          <div class="container-title">导师灯塔</div>
          <div class="container-content">
            <community-card class="community-item" v-for="(item, index) in communityList" :key="index" :community="item"
                            @tap-card="handleTap(item)"></community-card>
          </div>
        </div>

        <!-- 普通用户 -->
        <div v-if="dynamicList.length > 0">
          <div class="container-title" style="border-bottom: solid 1px #ededed;">TA的内容</div>
          <div class="container-content">
            <dynamic :dynamicList="dynamicList"
                     :showDelBtn="true"
                     :showIdentification="true"
                     :hideCommentBtn="true"
                     :hidePraiseBtn="true"
                     :showLightHouseInfo="true"
                     :disableUserClick="true"
            ></dynamic>
          </div>
        </div>
        <!-- 主体内容块 -->
        <!--<div class="big-shot-community-content">-->
        <!--<div class="module-content" v-if="dynamicList.length > 0">-->
        <!--<dynamic :dynamicList="dynamicList"-->
        <!--:showDelBtn="true"-->
        <!--:showIdentification="showIdentification"-->
        <!--&gt;</dynamic>-->
        <!--</div>-->
        <!--&lt;!&ndash;<div class='u-bottom-loading'>&ndash;&gt;-->
        <!--&lt;!&ndash;<img class='icon' src='../../static/icon/icon_loading.gif' wx:if='{{!pagination.end}}'></img>&ndash;&gt;-->
        <!--&lt;!&ndash;<text class='text' wx:else>没有更多内容了～</text>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--<div class="blank" v-else>-->
        <!--<img src="http://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/Uploads/static/picture/2017-12-14/20171214171938.png" />-->
        <!--<p>暂时没有内容～</p>-->
        <!--</div>-->
        <!--</div>-->
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
  import { getPersonalDetailsApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'big-shot-community',
    components: {
      dynamic,
      CommunityCard,
      Scroll
    },
    computed: {
      userCareer () {
        console.log('this.userInfo', this.userInfo)
        const {workTimeName, career, office} = this.userInfo
        console.log('career', career)
        let careerStr = ''

        if (workTimeName) {
          careerStr += workTimeName
        }
        if (careerStr && career) {
          careerStr += ' | ' + career
        } else {
          careerStr += career
        }
        if (careerStr && office) {
          careerStr += ' | ' + office
        } else {
          careerStr += office
        }
        console.log('careerStr', careerStr)
        return careerStr
      },
      userIdentify () {
        return this.userInfo['identify']
      },
      // 是否显示交换按钮
      isShowExchangeBtn () {
        return this.pageInfo['isSelf'] || this.pageInfo['isAgree']
      }
    },
    mixins: [ListMixin]
  })
  export default class community extends Vue {
    pageInfo = {}
    userInfo = {}
    dynamicList = []
    communityList = []
    showIdentification = false
    isComplete = true

    created () {
      this.pageInit().then(() => {})
    }

    async pageInit () {
      this.pagination.end = false // 初始化数据，必定不是最后一页
      await this.getList({page: 1})
    }

    // 跳转申请交换微信
    goExchange () {
      if (this.isComplete) { // 已完善个人资料跳转交换微信
        console.log('this.$route.params.userId', this.$route.params.userId)
        this.$router.push({name: 'exchange-apply', params: {userId: this.$route.params.userId}})
      } else { // 未完善跳转完善
        this.$vux.toast.text('完善信息才能交换微信', 'bottom')
        setTimeout(() => {
          this.$router.push({name: 'center-editinfo'})
        }, 2000)
      }
    }

    /**
     * 点击卡片
     */
    handleTap (item) {
      if (item.isJoined) { // 如果已经加入跳转到入社后页面
        this.$router.push(`/introduce/${item.communityId}/community`)
      } else { // 未入社跳到未入社页面
        this.$router.push(`/introduce/${item.communityId}`)
      }
    }

    // ------------------------------------------------
    /**
     * 获取用户个人详情
     **/
    getPersonalDetails (params) {
      return getPersonalDetailsApi(params)
    }

    // ------------------------------------------------

    async getList ({page, pageSize} = {}) {
      if (this.pagination.busy) {
        // 防止多次加载
        return
      }
      if (this.pagination.end) {
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      const params = {
        userId: this.$route.params.userId,
        page: page,
        pageCount: pageSize
      }

      this.pagination.busy = true
      const res = await this.getPersonalDetails(params)
      const {behaviorList, communityList, user, total, isComplete = true} = res
      this.isComplete = isComplete
      this.pageInfo = res
      this.userInfo = user
      if (page === 1) {
        this.dynamicList = behaviorList || []
        this.communityList = communityList || []
      } else {
        this.dynamicList = this.dynamicList.concat(behaviorList || [])
        this.communityList = this.communityList.concat(communityList || [])
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
    async loadNext () {
      const nextPage = this.pagination.page + 1
      await this.getList({page: nextPage})
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
    async handlePullup (loaded) {
      await this.loadNext().then(() => { loaded('done') })
      if (this.pagination.end) {
        loaded('ended')
      } else {
        loaded('done')
      }
    }
  }
</script>
<style lang="less" scoped>
  .userInfo-details {
    height: 100%;

  .community-item {
    margin: 0 15px 35px 15px;
  }

  background-color: #fff

  ;

  button:after {
    border-style: none;
  }

  &
  img {
    width: 100%;
    height: 100%;
  }

  .header {
    padding: 20px 15px;
    text-align: center;

  &
  .userInfo {
    font-size: 13px;
    color: #929292;
    text-align: center;

  }

  &
  .userInfo-img {
    width: 80px;
    height: 80px;
    font-size: 0;
    line-height: 1;
    position: relative;
    display: inline-block;
    border: solid 1px #ededed;
    border-radius: 50%;

  &
  img {
    border-radius: 50%;
  }

  &
  .sex {
    position: absolute;
    width: 22px;
    height: 22px;
    bottom: 0;
    right: 0;
  }

  }

  &
  .userInfo-desc {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    margin-top: 10px;

  &
  p:first-of-type {
    font-size: 18px;
    color: #354048;
    font-weight: 500;
  }

  &
  p:not(:first-of-type) {
    margin-top: 2px;
  }

  }

  &
  .exchange-btn {
    margin-top: 15px;
    width: 100px;
    height: 32px;
    line-height: 32px;
    border-radius: 16px;
    background-color: #fff;
    font-size: 15px;
    color: #d7ab70;
    border: solid 1px #d7ab70;

  &
  ::after {
    content: none;
  }

  }

  &
  .user-desc {
    margin-top: 12px;
    font-size: 12px;
    color: #bcbcbc;
    text-align: center;
  }

  }

  .container {
    margin-top: 16px;

  .empty-tip {
    margin-top: 100px;
    display: inline-block;
    line-height: 18px;
    font-size: 13px;
    color: #bcbcbc;
  }

  &
  .container-title {
    font-size: 18px;
    font-weight: 500;
    color: #929292;
    padding: 10px 0;
    margin: 0 15px;
  }

  }
  }
</style>
