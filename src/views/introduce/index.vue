<template>

  <!-- 大咖介绍页 -->
  <div class="big-shot-introduce">

    <div class="header">
      <community-card :community="pageInfo" :type="2" />
    </div>

    <div class="module">
      <div class="module-title">
        <div class="hr"></div>
        <p>关于灯塔</p>
      </div>
      <div class="module-content h5-code" v-html="pageInfo.intro">
      </div>
    </div>
    <div class="how-to-play">
      <a href="https://stg.ziwork.com/zikeappstatic/lighthousestatic/four/index.html">
        <img src="./../../assets/how2play.png" />
      </a>
    </div>
    <div class="module" v-if="dynamicList.length > 0">
      <div class="module-title">
        <p>精选内容</p>
        <div class="hr"></div>
      </div>
      <div class="module-content">
        <dynamic :dynamicList="dynamicList"
                 :hideCommentArea="false"
                 :showDelBtn="true"
                 :showIdentification="false"
                 :showLightHouseInfo="false"
                 :disableOperationArr="disableOperationArr"
                 @disableOperationEvents="disableOperationEvents"
        ></dynamic>
      </div>
      <div class="desc">
        只能查看3条信息，加入后查看更多
      </div>
    </div>

    <div class="footer">
      <div class="to-home">
        <img src="./../../assets/icon/icon_home.png" class="icon-home" />
        <span>首页</span>
      </div>
      <div class="time-clock" v-if="isJoinAgency">
        <p>开课倒计时</p>
        <p>{{pageInfo.duration}}</p>
      </div>
      <p v-else-if="isEnd">课堂已关闭，停止报名</p>
      <p v-else-if="pageInfo.remainingJoinNum <= 0">已满员，停止报名</p>
      <div class="btn-box" v-else>
        <button :class="{'free-btn': isFreeBtn, 'free-btn-disable': !isFreeBtn}"
                :disabled="!isFreeBtn" v-if="pageInfo.freeJoinNum > 0" @click="freeIn">
          <span>集Call免费加入</span>
          <span>({{freeSurplusPeople > 0 ? '剩余：' + freeSurplusPeople : '已满员，通道关闭'}})</span>
        </button>
        <button :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="subscribe('pay')" v-if="pageInfo.payJoinNum > 0">
          <span>付费加入:¥{{pageInfo.joinPrice}}/{{pageInfo.cycle}}</span>
          <span>({{paySurplusPeople > 0 ? '剩余：' + paySurplusPeople : '已满员，通道关闭'}})</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import CommunityCard from '@/components/communityCard'
  import dynamic from '@/components/dynamic/dynamic'
  import {getCommunityInfoApi} from '@/api/pages/pageInfo'
  import { share } from '@/api/wx/share'

  @Component({
    name: 'big-shot-introduce',
    components: {
      dynamic,
      CommunityCard
    },
    computed: {
      // 剩余免费名额
      freeSurplusPeople () {
        let n = parseInt(this.pageInfo.freeJoinNum) - parseInt(this.pageInfo.freeJoinedNum)
        return n
      },
      // 剩余付费名额
      paySurplusPeople () {
        let n = parseInt(this.pageInfo.payJoinNum) - parseInt(this.pageInfo.payJoinedNum)
        return n
      },
      // 是否已入社
      isJoinAgency () {
        return this.pageInfo.isAuthor || this.pageInfo.isJoined
      },
      // 是否已结束
      isEnd () {
        let {serverTime, endTime} = this.pageInfo
        return new Date(serverTime) > new Date(endTime)
      },
      isFreeBtn () {
        return this.freeSurplusPeople > 0
      },
      isPayBtn () {
        return this.paySurplusPeople > 0
      }
    }
  })
  export default class introduce extends Vue {
    pageInfo = {}
    dynamicList = []
    disableOperationArr = ['comment', 'praise']
    freeIn () { // 跳转到一个图文消息
      console.log('免费集call')
    }
    payOrFree (type) {
      console.log('支付')
      const that = this
//      if (type === 'pay') {
//        let {startTime, endTime} = that.pageInfo
//        startTime = new Date(startTime * 1000)
//        endTime = new Date(endTime * 1000)
//
//        this.$vux.confirm.show({
//          content: `你将加入${startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate()}至${endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate()}导师的灯塔，加入后不支持退出、转让，请再次确认。`,
//          confirmText: '确定',
//          cancelText: '取消',
//          onConfirm: function (res) {
//            if (res.confirm) {
//              payApi({
//                productId: that.pageInfo.communityId,
//                productType: 1
//              }).then((res) => {
//                res.success = function () {
//                  // 刷新当前页
//                  if (self.isAudit) {
//                    this.$vux.confirm.show({
//                      title: '恭喜',
//                      content: `您已加入${res.title},请及时关注【自客】公众号进塔。`,
//                      confirmText: '好的',
//                      showCancel: false,
//                      onConfirm: () => {
//                        this.$router.go(-1)
//                      }
//                    })
//                  } else {
//                    that.init()
//                  }
//                }
//                wx.requestPayment(res)
//              }).catch((e) => {
//                console.log(e.message)
//              })
//            }
//          },
//          confirmColor: '#d7ab70'
//        })
//      } else {
//        console.log('重要url', '/pages/freeEnroll/index?communityId=' + that.communityId + '&userId=' + that.$parent.globalData.userInfo.userId + '&formId=' + formId)
//        wx.navigateTo({
//          url: '/pages/freeEnroll/index?communityId=' + that.communityId + '&userId=' + that.$parent.globalData.userInfo.userId + '&formId=' + formId
//        })
//      }
    }
    created () {
      // 修改页面分享信息
      share(this.$wechat, this.$http, {
        'titles': `好友或qq好友的title`,
        'title': `朋友圈或QQ`,
        'desc': '描述',
        'imgUrl': `https://light-wap.house.api.ziwork.com/static/img/login-logo.bdbf03e.png`,
        'link': location.href.split('?')[0]
      })
      this.pageInit().then(() => {})
    }

    async pageInit () {
      const { communityId } = this.$route.params
      const res = await getCommunityInfoApi(communityId)

      const temp = new Array(...res.circles)
      temp.forEach((item) => {
        if (item['modelType'] === 'problem') {
          item['answers'].forEach((answer) => {
            answer.musicState = 0
            answer.progress = 0
          })
        } else if (item['circleType'] === 1) {
          item.musicState = 0
          item.progress = 0
        } else if (res['circleType'] === 2) {
          item.videoPlay = false
        }
      })
      this.dynamicList = temp
      this.pageInfo = res
    }

    disableOperationEvents (e) {
      const {eventType} = e
      console.log(eventType, '拦截')

      const _this = this
      this.$vux.confirm.show({
        title: '评论点赞',
        content: '您还没有加入，暂时不能操作',
        confirmText: '付费加入',
        cancelText: '我知道了',
        onCancel () {
        },
        onConfirm () {
          console.log(_this) // 当前 vm
        }
      })
    }
  }
</script>
<style lang="less" scoped>
  .big-shot-introduce {
    padding-bottom: 54px;

    & .header {
    }

    & .container {
      margin-top: 20px;
    }

    & .module {

      &.h5-code {
        display: block;
        max-width: 100%;
        line-height: 1.5;
        font-size: 16px;
        overflow: hidden;
      }

      .module-title {
        margin: 0 15px;
        font-size: 18px;
        color: #929292;
        font-weight: 500;

        & p {
          display: block;
          padding: 30px 0 10px;
        }
      }
      .module-content {

        &.h5-code {
          padding: 0 15px;
          font-size: 15px;
          word-wrap: break-word;
          width: 100%;
          box-sizing: border-box;

          & img {
            max-width: 100% !important;
          }
        }
      }

      & .hr {
        height: 1px;
        background: #dcdcdc;
      }

      & .desc {
        color: #bcbcbc;
        font-size: 13px;
        padding: 20px 0;
        text-align: center;
      }
    }

    & .footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 54px;
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #bcbcbc;
      z-index: 999;
      font-size: 15px;

      & .btn-box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        height: 100%;
      }

      & .to-home {
        flex: 0 0 auto;
        width: 52px;
        height: 100%;
        border-top: solid 1px #dcdcdc;
        border-right: solid 1px #ededed;
        font-size: 11px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: #929292;
        background-color: #ffffff;
      }

      & .time-clock {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #ffffff;
        box-shadow: 0 -1px 0 0 #dcdcdc;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666666;
        & p:last-of-type {
          margin-left: 15px;
          color: #d7ab70;
        }
      }

      & button {
        flex-grow: 1;
        height: 100%;
        font-size: 13px;
        line-height: 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        border-style: none;
        border-radius: 0;
        border-top: solid 1px #dcdcdc;
        &:after {
          border-style: none;
        }

        & span {
          display: block;
          margin-top: 6px;
        }
        & span:first-of-type {
          margin-top: 0;
          font-size: 15px;
        }

        &.free-btn {
          color: #d7ab70;
          background-color: #ffffff;
        }
        &.pay-btn {
          color: #354048;
          background-color: #ffe266;
          & span:not(:first-of-type) {
            color: rgba(53, 64, 72, 0.8);
          }
        }
        &.free-btn-disable, &.pay-btn-disable {
          color: #bcbcbc;
        }
      }
    }

    & .how-to-play {
      margin-top: 30px;
      padding: 0 30px;

      & img {
        border-radius: 6px;
        width: 100%;
        height: auto;
        vertical-align: middle;
        text-align: center;
      }
    }

    & .icon-home {
      width: 18px;
      height: 16px;
      margin-bottom: 7px;
    }
  }
</style>
