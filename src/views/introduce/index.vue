<template>

  <!-- 大咖介绍页 -->
  <div class="big-shot-introduce">

    <div class="header">
      <community-card :community="pageInfo" :type="2" />
      <div class="share-btn" @click="showShare = true">
        <img class="share-icon" src="./../../assets/icon/icon_share.png" />
        <span>分享</span>
      </div>
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
    <div class="module" v-if="completelyShow && dynamicList.length > 0">
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

    <div class="footer" v-if="completelyShow">
      <div class="to-home" @click="toHome">
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
        <div :class="{'free-btn': isFreeBtn, 'free-btn-disable': !isFreeBtn}"
                :disabled="!isFreeBtn" v-if="pageInfo.freeJoinNum > 0" @click="freeIn">
          <span>集Call免费加入</span>
          <span>({{freeSurplusPeople > 0 ? '剩余：' + freeSurplusPeople : '已满员，通道关闭'}})</span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="payOrFree" v-if="pageInfo.payJoinNum > 0">
          <span>付费加入:¥{{pageInfo.joinPrice}}/{{pageInfo.cycle}}</span>
          <span>({{paySurplusPeople > 0 ? '剩余：' + paySurplusPeople : '已满员，通道关闭'}})</span>
        </div>
      </div>
    </div>
    <!--分享弹窗-->
    <share-dialog :isShow="showShare" @close-share="showShare = false"
                  :shareType="1"></share-dialog>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import CommunityCard from '@/components/communityCard'
  import dynamic from '@/components/dynamic/dynamic'
  import {getCommunityInfoApi} from '@/api/pages/pageInfo'
  import WechatMixin from '@/mixins/wechat'
  import {payApi} from '@/api/pages/pay'
  import wxUtil from '@/util/wx/index'
  import ShareDialog from '@/components/shareDialog/ShareDialog'
  import flexible from '@/util/flexible'

  @Component({
    name: 'big-shot-introduce',
    components: {
      dynamic,
      CommunityCard,
      ShareDialog
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
    },
    mixins: [WechatMixin]
  })
  export default class introduce extends Vue {
    showShare = false // 显示分享弹框
    pageInfo = {}
    dynamicList = []
    disableOperationArr = ['comment', 'praise']
    completelyShow = true
    pxToRem (_s) {
      // 匹配:20px或: 20px不区分大小写
      const reg = /(\:|: )+(\d)+(px)/gi
      let newStr = _s.replace(reg, function (_x) {
        _x = _x.replace(/(\:|: )/, '').replace(/px/i, '')
        return ':' + parseFloat(_x) / 32 + 'rem'
      })
      return newStr
    }
    freeIn () { // 跳转到一个图文消息
      if (this.pageInfo.wechatIntroUrl) {
        location.href = this.pageInfo.wechatIntroUrl
      } else {
        this.$vux.toast.text('网络延时，等下再来试试吧~', 'bottom')
      }
    }
    payOrFree () {
      let that = this
      let {startTime, endTime} = this.pageInfo
      startTime = new Date(startTime * 1000)
      endTime = new Date(endTime * 1000)
      this.$vux.confirm.show({
        content: `你将加入${startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate()}至${endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate()}导师的灯塔，加入后不支持退出、转让，请再次确认。`,
        confirmText: '确定',
        cancelText: '取消',
        onConfirm: function (res) {
          console.log(res)
          that.payIn()
        },
      })
    }
    toHome () {
      this.$router.replace(`/index`)
    }
    async payIn () {
      try {
        const params = await payApi({
          productId: this.pageInfo.communityId,
          productType: 1
        })
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(params), false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(params))
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(params))
          }
        } else {
          this.onBridgeReady(params)
        }
      } catch (e) {
        this.$vux.toast.text(e.message, 'bottom')
      }
      this.pageInit()
    }
    onBridgeReady (params) {
//      this.closeEvent()
      let self = this
      /*eslint-disable*/
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
          appId: params.appId,
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.package,
          signType: params.signType,
          paySign: params.paySign
        },
        function (res) {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            self.$vux.toast.text('已购买成功', 'bottom')
            location.reload()
//            location.href = location.href.split('?')[0] + '?' + new Date().getTime() // todo 假如原来有参数需要换种写法
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            self.$vux.toast.text('已取消支付', 'bottom')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            self.$vux.toast.text('支付失败，请重新购买', 'bottom')
          }
        }
      )
    }
    created () {
      wxUtil.reloadPage()
      if (this.$route.name === 'introduce-detail') {
        this.completelyShow = false
      }

      this.pageInit().then(() => {
        const {title, simpleIntro, master, shareImg, communityId} = this.pageInfo
        // 是否已入社
        if (this.completelyShow && this.isJoinAgency) {
          this.$router.replace(`/introduce/${communityId}/community`)
          return
        }

        const {realName, career} = master
        const str = realName ? realName + (career ? '|' + career : '') : ''
        console.log('location.href', location.href)
        // 页面分享信息
        this.wechatShare({
          'titles': str + '|' + title,
          'title': str + '|' + title,
          'desc': simpleIntro,
          'imgUrl': shareImg,
          'link': location.href.split('?')[0]
        })
      })
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
      this.pageInfo.intro = this.pxToRem(this.pageInfo.intro)
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
<style lang="less" scoped type="text/less">
  .big-shot-introduce {
    padding-bottom: 54px;

    & .header {
      margin-bottom: 20px;
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

      & p {
        flex-grow: 1;
        text-align: center;
      }

      & .btn-box {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        height: 100%;
      }

      & .to-home {
        flex: 0 0 auto;
        width: 52px;
        height: 100%;
        border-top: solid 1px #dcdcdc;  /* no */
        border-right: solid 1px #ededed;  /* no */
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

      & div {
        flex-grow: 1;
        height: 100%;
        font-size: 13px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        border-style: none;
        border-radius: 0;
        border-top: solid 1px #dcdcdc;  /* no */
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
      padding: 0 15px;

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
      margin-bottom: 2px;
    }
  }
</style>
