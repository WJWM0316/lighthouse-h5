<template>

  <!-- 大咖介绍页 -->
  <div class="p-body big-shot-introduce">

    <div class="container" ref="big-shot-introduce-container">
      <div class="header">
        <community-card ref="headCard" :community="pageInfo" :type="2" />
        <div class="share-btn-3" v-if="!pageInfo.isAudit && pageInfo.isSell === 2" @click="showSell = true">
          <span>邀请函</span>
        </div>
        <div class="share-btn-2" v-else-if="!pageInfo.isAudit && pageInfo.isSell === 1" @click="showSell = true">
          <span>分享赚¥{{pageInfo.sellPrice}}</span>
        </div>
        <div class="share-btn" v-else @click="showShare = true">
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
        <a href="https://stg.ziwork.com/zikeappstatic/lighthousestatic/howplay/index.html">
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
                   :disableUserClick="true"
          ></dynamic>
        </div>
        <div class="desc">
          加入灯塔社区，即可解锁更多内容~
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="module relevant" v-if="relevantList.length > 0">
        <div class="module-title">
          <p>相关灯塔</p>
          <div class="hr"></div>
        </div>
        <div class="module-content">
          <community-info-card class="community-item" v-for="item in relevantList" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
        </div>
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
        </div>
      </div>
    </div>
    <!--分享弹窗-->
    <share-dialog :isShow="showShare" @close-share="showShare = false"
                  :shareType="1"></share-dialog>

    <div class="home-mask" v-if="showSell">
      <div class="sell-container">
        <i class="u-icon-close icon-close" @click="showSell = false"></i>
        <div class="Qr">
          <img src="./../../assets/page/wx-qrcode.png">
        </div>
        <p>长按识别二维码，关注公众号即可获取</p>
        <p>{{pageInfo.isSell && pageInfo.isSell === 2 ? '专属海报，邀请好友一起学习' : '专属海报及查询实时奖励'}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import CommunityCard from '@/components/communityCard'
  import dynamic from '@/components/dynamic/dynamic'
  import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
  import {getCommunityInfoApi, countCodeApi} from '@/api/pages/pageInfo'
  import WechatMixin from '@/mixins/wechat'
  import {payApi} from '@/api/pages/pay'
  import wxUtil from '@/util/wx/index'
  import ShareDialog from '@/components/shareDialog/ShareDialog'

  @Component({
    name: 'big-shot-introduce',
    components: {
      dynamic,
      communityInfoCard,
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
    watch: {
      '$route' (route) {
        if (this.$refs['big-shot-introduce-container']) {
          console.log(this.$refs['big-shot-introduce-container'])
          this.$refs['big-shot-introduce-container'].scrollTop = 0
        }
        if (this.$refs['headCard']) {
          this.$refs['headCard'].stopCountdown()
        }
        this.pageInit().then(() => {
          const {
            title,
            simpleIntro,
            master,
            shareImg, // 分享图片
            sharePoint, // 分享摘要
            shareIntroduction,  // 分享标题
            communityId
          } = this.pageInfo
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
            'titles': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
            'title': `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
            'desc': sharePoint || simpleIntro,
            'imgUrl': shareImg,
            'link': location.origin + `/beaconweb/#/introduce/${communityId}`
          })
        })
      }
    },
    mixins: [WechatMixin]
  })
  export default class introduce extends Vue {
    showShare = false // 显示分享弹框
    showSell = false // 显示分销弹框
    pageInfo = {}
    dynamicList = []
    relevantList = []
    disableOperationArr = ['comment', 'praise']
    completelyShow = true
    el = ''

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
      if (!this.isFreeBtn) return
      if (this.pageInfo.wechatIntroUrl) {
        location.href = this.pageInfo.wechatIntroUrl
      } else {
        this.$vux.toast.text('网络延时，等下再来试试吧~', 'bottom')
      }
    }
    payOrFree () {
      let that = this
      that.payIn()
//      let {startTime, endTime} = this.pageInfo
//      startTime = new Date(startTime * 1000)
//      endTime = new Date(endTime * 1000)
//      this.$vux.confirm.show({
//        content: `你将加入${startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate()}至${endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate()}导师的灯塔，加入后不支持退出、转让，请再次确认。`,
//        confirmText: '确定',
//        cancelText: '取消',
//        onConfirm: function (res) {
//          console.log(res)
//          that.payIn()
//        },
//      })
    }
    toHome () {
      this.$router.replace(`/index`)
    }

    /**
     * 点击卡片
     */
    handleTapCard (item) {
      if (item.isAuthor === 1 || item.isJoined === 1) { // 如果已经加入并且已入社跳转到入社后页面
        this.$router.push(`/introduce/${item.communityId}/community`)
      } else { // 未入社跳到未入社页面
        this.$router.push(`/introduce/${item.communityId}`)
      }
    }

    async payIn () {
      const params = await payApi({
        productId: this.pageInfo.communityId,
        productType: 1
      })
      console.log('params', params)
      const arr = Object.keys(params || {})
      if (arr.length !== 0) {
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
        this.pageInit()
      }
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
            const { communityId } = self.$route.params
            console.log('communityId', communityId)
            //
            if (communityId === 'ca7cfa129f1d7ce4a04aebeb51e2a1aa') {
              self.$store.dispatch('show_qr')
            } else {
              location.reload()
            }
//            self.$store.dispatch('show_qr')
//            location.href = location.href.split('?')[0] + '?' + new Date().getTime() // todo 假如原来有参数需要换种写法
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            self.$vux.toast.text('已取消支付', 'bottom')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            self.$vux.toast.text('支付失败，请重新购买', 'bottom')
          }
        }
      )
    }
    async created () {
      console.log(location.href, decodeURIComponent(location.href))
      wxUtil.reloadPage()
      if (this.$route.name === 'introduce-detail') {
        this.completelyShow = false
      }
      const { code=''} = this.$route.query
      if (code) {
        try {
          await countCodeApi({code: code})
        } catch (e) {
          this.$vux.toast.text(e.message, 'bottom')
        }
      }
      await this.pageInit().then(() => {
        const {
          title,
          simpleIntro,
          master,
          shareImg, // 分享图片
          sharePoint, // 分享摘要
          shareIntroduction,  // 分享标题
          communityId
        } = this.pageInfo
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
          'titles': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'title': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'desc': sharePoint || simpleIntro,
          'imgUrl': shareImg,
          'link': location.origin + `/beaconweb/#/introduce/${communityId}`
        })
      })
      const { autoPay=''} = this.$route.query
      if (autoPay) {
        let that = this
        that.payIn()
      }
    }

    async pageInit () {
      const { communityId } = this.$route.params
      const { saleId: applyId } = this.$route.query
      const res = await getCommunityInfoApi({communityId, data: {applyId}})

      const temp = new Array(...res.circles || [])
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
          item.videoPlay = false
        }
      })
      console.log(temp)
      this.dynamicList = temp
      this.relevantList = res.relevantRecommendations || []
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
          _this.payOrFree()
        }
      })
    }
  }
</script>
<style lang="less" scoped type="text/less">
  .big-shot-introduce {
    /*padding-bottom: 55px;*/
    /*height: auto;*/
    /*min-height: 100%;*/
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;

    & .header {
      position: relative;
      margin-bottom: 20px;

      & .share-btn, & .share-btn-2, & .share-btn-3 {
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
          margin-left: 10px;
        }

        &::after {
          content: none;
        }
      }

      & .share-btn-2 {
        position: fixed;
        padding-left: 10px;
        min-width: 85px;
        background-color: #ffe266;
        font-size: 13px;
        color: #354048;
        z-index: 99;
      }

      & .share-btn-3 {
        position: fixed;
        padding-left: 13px;
        padding-right: 7px;
        background-color: #ffe266;
        width: inherit;
        font-size: 13px;
        color: #354048;
        z-index: 99;
      }
    }

    & .container {
      flex: 1 1 auto;
      overflow: auto;
      -webkit-overflow-scrolling: touch;  /* 针对 overflow: scroll; 在ios中卡顿问题 */
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
        .community-item {
          margin-top: 25px;
        }

        &.h5-code {
          padding: 0 15px;
          font-size: 15px;
          word-wrap: break-word;
          width: 100%;
          box-sizing: border-box;

          & img {
            max-width: 100% !important;
            margin: 0 auto;
          }
        }
      }

      & .hr {
        height: 1px; /* no */
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
      flex: 0 0 auto;
      /*position: fixed;*/
      /*left: 0;*/
      /*bottom: 0;*/
      width: 100%;
      height: 54px;
      position: relative;
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
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: #929292;
        background-color: #ffffff;
        & > span {
          font-size: 11px !important;
        }
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
          margin-top: 2px;
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
      padding: 0 15px 25px;

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
      margin-bottom: 5px;
    }

    & .home-mask {
      & .sell-container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 285px;
        background: #fff;
        border-radius: 6px;
        transform: translate(-50%, -50%);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        padding: 45px 0;
        font-size: 15px;
        color: #666666;

        & .Qr {
          width: 160px;
          height: 160px;
          font-size: 0;
          margin-bottom: 12px;
        }
        & img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          text-align: center;
        }
      }
    }
  }
</style>
