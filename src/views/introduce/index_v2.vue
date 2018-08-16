<template>

  <!-- 大咖介绍页 -->
  <div ref="body" class="big-shot-introduce">

    <div class="container" ref="big-shot-introduce-container" :class="{ 'no-pdb': !completelyShow }">
      <div class="header">

        <community-card ref="headCard" :community="pageInfo" :type="2" />
        <div class="share-group">
          <div class="group_wrap">
            <button type="button" class="home u-btn" @click="toHome"><i class="u-icon-community-home"></i></button>
            <button type="button" class="invite u-btn" v-if="!pageInfo.isAudit && pageInfo.isSell === 2" @click="showSell = true">邀请函</button> 
            <button type="button" class="money u-btn" v-else-if="!pageInfo.isAudit && pageInfo.isSell === 1"  @click="showSell = true">
              ¥{{pageInfo.sellPrice}}
            </button>
            <button type="button" class="share u-btn" v-else @click="showShare = true"><i class="u-icon-share-community"></i></button>
          </div>
          <span class="money_other" v-if="!pageInfo.isAudit && pageInfo.isSell === 1">
            分享赚
            <img src="../../assets/icon/bg_share.png" />
          </span>
        </div>
      </div>

      <div class="module"  style="min-height: 70vh" >
        <div class="module-title">
          <p>关于灯塔</p>
        </div>
        <div class="module-content h5-code" v-if="pageInfo.intro" v-html="pageInfo.intro" >
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
          加入灯塔，即可解锁更多内容~
        </div>
      </div>

      <!-- 试读内容 -->
      <div class="module relevant" v-if="pageInfo.tryCourses&&pageInfo.tryCourses.length>0">
        <div class="module-title">
          <p>试读内容</p>
          <div class="hr"></div>
        </div>
        <div class="module-content">
          <div class="attempt_list"  >
            <div class="attempt_block" v-for="item,index in pageInfo.tryCourses" @click.stop="toLesson(item.id)">
              <img class='blo_left' :src="item.coverPicture" />
              <div class='blo_center'>{{item.title}}撒打算打算打算打算打算打算打算打算打算打算的撒打算打算打撒撒打算打打算打算的</div>
              <div class='blo_right'>试读</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="joinHint">加入灯塔，即可解锁更多内容～</div>

    <div class="footer" v-show="completelyShow">
      <div class="time-clock" v-if="isJoinAgency">
        <p>开课倒计时</p>
        <p>{{pageInfo.duration}}</p>
      </div>
      <p v-else-if="pageInfo.communityStatus === 2">课程已下线，暂时不可加入</p>
      <p v-else-if="pageInfo.remainingJoinNum <= 0">课程已满员，暂时不可加入</p>
      <div class="btn-box" v-else>
        <div :class="{'free-btn': isFreeBtn, 'free-btn-disable': !isFreeBtn}"
                :disabled="!isFreeBtn" v-if="pageInfo.freeJoinNum > 0" @click="freeIn">
          <span>集Call免费加入</span>
          <span>({{freeSurplusPeople > 0 ? '剩余：' + freeSurplusPeople : '已满员'}})</span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="payOrFree" v-if="pageInfo.payJoinNum > 0 && pageInfo.joinPrice > 0">
          <span>付费加入:¥{{pageInfo.joinPrice}}</span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="freeJoin" v-if="pageInfo.payJoinNum > 0 && pageInfo.joinPrice === 0">
          <span>免费加入</span>
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
          <img :src="qrSrc">
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
  import CommunityCard from '@/components/communityCard_v2'
  import dynamic from '@/components/dynamic/dynamic'
  import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
  import {getCommunityInfoApi, countCodeApi} from '@/api/pages/pageInfo'
  import WechatMixin from '@/mixins/wechat'
  import {payApi, freePay} from '@/api/pages/pay'
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
      	console.log("333333333333",this.pageInfo.isJoined,this.pageInfo.isAuthor)
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
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.pageYOffset = 0
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
          console.log("222222222",this.pageInfo)
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
    disableOperationArr = ['comment', 'praise']
    completelyShow = true
    el = ''
    qrSrc = ''
    testCoures = true   //新版测试使用
    isEndSock = false  //已结束的锁   
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
      if(this.isEnd ){
        if(!this.isEndSock){
          this.endHint(1)
          return
        }
      }

      if (!this.isFreeBtn) return
      if (this.pageInfo.wechatIntroUrl) {
        location.href = this.pageInfo.wechatIntroUrl
      } else {
        this.$vux.toast.text('网络延时，等下再来试试吧~', 'bottom')
      }
    }

    // 已结束提示 
    endHint(type){
      let that = this
      if(!type){
        return
      }
      
      this.$vux.confirm.show({
        title: '加入须知',
         content: `该课程已经全部更新完毕了！ \/n 加入后你获得以下内容： \/n 1、塔主课程以及小伙伴们沉淀 下来的宝贵内容；\/n  2、和成员们一起交流学习； \/n 3、提问导师或嘉宾，但不一定 能100%得到回答`,
         confirmText: '马上加入',
         cancelText: '我再想想',
         onConfirm: function (res) {
          that.isEndSock = true
           if(type == 1){
              that.freeIn()
           }else if(type == 2) {
              that.payOrFree()
           }else {
              that.freeJoin()
           }
         },
       })
    }


    payOrFree () {
      if(this.isEnd ){
        if(!this.isEndSock){
          this.endHint(2)
          return
        }
      }

      let that = this
      that.payIn()
    }
    async freeJoin () {
      let that = this
      if(this.isEnd ){
        if(!this.isEndSock){
          this.endHint(3)
          return
        }
      }

      await freePay({
        productId: this.pageInfo.communityId,
        productType: 1
      }).then((res) => {
        const _this = this
        that.$vux.alert.show({
          title: '加入成功',
          content: '快去灯塔里和大家一起进步吧',
          buttonText: '好的',
          onHide () {
            _this.pageInit().then(() => {})
          }
        })
      }).catch((e) => {
        that.$vux.toast.text(e.message, 'bottom')
      })
    }
    toHome () {
      this.$router.replace(`/index`)
    }

    /**
     * 点击卡片
     */
    handleTapCard (item) {

      let url = ''
      if (item.isAuthor === 1 || item.isJoined === 1) { // 如果已经加入并且已入社跳转到入社后页面
        this.$router.push(`/introduce/${item.communityId}/community`)
      } else { // 未入社跳到未入社页面
        // 测试
        if(this.testCoures){
          url = `/introduce2/${item.communityId}?reload=true`
        }else {
          url = `/introduce/${item.communityId}?reload=true`
        }
      	this.completelyShow=true;
        this.$router.push(url)
        //03b9200ec0d02059adc1882956104bc2
        //03b9200ec0d02059adc1882956104bc2
      }
    }

    async payIn () {
      const params = await payApi({
        productId: this.pageInfo.communityId,
        productType: 1
      })
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
      let self = this
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
            let number = Math.random() * 10 + 1
            console.log('communityId', communityId)
            //
            switch (communityId) {
              case 'ca7cfa129f1d7ce4a04aebeb51e2a1aa':
                self.$store.dispatch('show_qr', {type: 1})
                break
              case '25c2ff088da3f757b685a318ab050b5a': // 测试
                self.$store.dispatch('show_qr', {type: 1})
                break
              case '64074da38681f864082708b9be959e08':
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '67917ba04abd74c3247245576b1168b0': // 测试
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '16a2f4a61d870978f1598b466a48f12e': // 测试 詹润杰的灯塔
                self.$store.dispatch('show_qr', {type: 3})
                break
              case 'a7f79b000c990dd2658b6af10a37fe3c': // 正式 詹润杰的灯塔
                self.$store.dispatch('show_qr', {type: 3})
                break
              case '70036858d957ad830e89e37c5a8356d2': // 测试分销5月9号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '6b3974ad38fa6984de73f43a7730e294': // 正式分销5月9号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case 'b2b533754554bec1b9c344a97063891b': // 测试分销5月16号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '2cdf75243f96bca97ae4341b6400e375': // 正式分销5月16号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case '67917ba04abd74c3247245576b1168b0': // 分销5月22号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case 'd71fddeba62a878aecd901198a959674': // 正式分销5月17号
                self.$store.dispatch('show_qr', {type: 2})
                break
              case 'cfaf4bc3648d04a809419d52a78d8d20': // 秋叶塔
                self.$store.dispatch('show_qr', {type: 4})
                break
              case 'db73998f8d1691d3ce75180266e3cba9': // 测试专用
                self.$store.dispatch('show_qr', {type: 4})
                break
              default:
                location.reload()
                break
            }
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            self.$vux.toast.text('已取消支付', 'bottom')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            self.$vux.toast.text('支付失败，请重新购买', 'bottom')
          }
        }
      )
    }
    async created () {
      wxUtil.reloadPage()
      if (this.$route.name === 'introduce-detail') {
        this.completelyShow = false
      }
      const { code='' } = this.$route.query
      const { communityId } = this.$route.params
      if (code) {
        try {
          if (communityId === 'a7f79b000c990dd2658b6af10a37fe3c') { // 如果为此社区 跳转首页
            this.$router.replace(`/index`)
          }
          await countCodeApi({ code, communityId })
        } catch (e) {
          this.$vux.toast.text(e.message, 'bottom')
        }
      }
      const self = this
      await this.pageInit().then(() => {
        const {
          title,
          simpleIntro,
          master,
          shareImg, // 分享图片
          sharePoint, // 分享摘要
          shareIntroduction,  // 分享标题
          communityId
        } = self.pageInfo

        const {realName, career} = master
        //  const str = realName ? realName + (career ? '|' + career : '') : ''
        console.log('location.href', location.href)
        // 页面分享信息
        self.wechatShare({
          'titles': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'title': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'desc': sharePoint || simpleIntro,
          'imgUrl': shareImg,
          'link': location.origin + `/beaconweb/#/introduce/${communityId}`
        })
      })
      const { autoPay=''} = this.$route.query
      console.log('autoPay', autoPay)
      if (autoPay) {
        let that = this
        that.payIn()
      }
    }

    async pageInit () {
      const { communityId } = this.$route.params
      switch (communityId) {
        case 'aa3b415b564bd95b27da2f0e9c986e6a':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
        case '25c2ff088da3f757b685a318ab050b5a':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
        case 'b2b533754554bec1b9c344a97063891b':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
        case '2cdf75243f96bca97ae4341b6400e375':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
        case '67917ba04abd74c3247245576b1168b0':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
        default:
          this.qrSrc = require('@/assets/page/qr_gzh_1.png')
          break
      }

      const { saleId: applyId } = this.$route.query
      const res = await getCommunityInfoApi({communityId, data: {applyId}})

      this.pageInfo = res
      console.log(111111,res)
      // 是否已入社
      if (this.completelyShow && this.isJoinAgency) {

        if(res.isCourse === 3){
          this.$router.replace(`/introduce2/${communityId}/community`)
        }else {
          this.$router.replace(`/introduce/${communityId}/community`)
        }
        return
      }

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
      this.pageInfo.intro = this.pxToRem(this.pageInfo.intro)
    }

    disableOperationEvents (e) {
      const {eventType} = e
      console.log(eventType, '拦截')

      const _this = this
      const isBuy = _this.pageInfo.joinPrice > 0
      this.$vux.confirm.show({
        title: '评论点赞',
        content: '您还没有加入，暂时不能操作',
        confirmText: isBuy ? '付费加入' : '免费加入',
        cancelText: '我知道了',
        onCancel () {
        },
        onConfirm () {
          console.log(_this) // 当前 vm
          if (isBuy) {
            _this.payOrFree()
          }
          else {
            _this.freeJoin().then(() => {})
          }
        }
      })
    }

    mounted () {
      // this.$refs['body'].addEventListener('touchmove', e => {
      //   e.stopPropagation()
      // })
    }

    toLesson (id) {
      this.$router.push({path:`/Lesson?id=${id}&isTry=1&communityId=${this.pageInfo.communityId}`})
    }
    
  }
</script>
<style lang="less" scoped type="text/less">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .joinHint {
    font-size: 14px;
    font-family: PingFangSC-Light;
    color: rgba(188,188,188,1);
    line-height: 18px;
    margin-bottom: 34px;
    text-align: center;
  } 
  .big-shot-introduce {
   	height: 100%;
    padding-bottom: 55px;
    box-sizing: border-box;
    overflow-y: auto;
    &.no-pdb {
    	
      padding-bottom: 0;
    }

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

      .share-group {
        position: fixed;
        right: 10px;
        top: 25px;
        line-height: 1;
        font-size: 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
        z-index: 99;
        border-radius: 16px;
        .group_wrap {
          overflow: hidden;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          background: #fff;
        }
        .money_other {
          width: 60px;
          height: 23px;
          position: absolute;
          right: 0;
          top: -20px;
          border-raidus: 40px;
          font-size:12px;
          font-family:PingFangSC-Regular;
          color:rgba(53,64,72,1);
          line-height:18px;
          text-align: center;
          z-index: 100;

          img {
            width: 60px;
            height: 23px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: -1;
          }
        }
        &.fixed {
          position: fixed;
        }

        .u-btn {
          position: relative;
          line-height: 18px;
          font-size: 13px;
          color: @font-color-default;

          &:first-child {
            padding: 8px 12px 6px 15px;
          }

          &:last-child {
            padding: 8px 15px 6px 12px;
          }

          &.home,
          &.share {
            background: #fff;

            &:active {
              background: #f1f1f1;
            }
          }
          &.type_2 {
            padding: 8px 10px 6px 12px;
          }
          &.type_3 {
            padding: 6px 11px 6px 10px;
          }
          &.share:after {
            content: " ";
            display: block;
            position: absolute;
            right: 100%;
            top: 8px;
            background: #d8d8d8;
            width: 1px; /* no */
            height: 18px;
          }

          &.invite,
          &.money {
            background: #ffe266;
            
          }
        }
      }
    }

    & .container {
      /*flex: 1 1 auto;*/
      /*overflow: hidden;*/
      /*overflow-y: scroll;*/
      /*-webkit-overflow-scrolling: touch;  !* 针对 overflow: scroll; 在ios中卡顿问题 *!*/
    }

    & .module {

      .module-title {
        margin: 0 15px;
        font-size: 18px;
        color: #929292;
        font-weight: 600;
        & p {
          display: block;
					font-size:18px;
          padding: 30px 0 15px 20px;
					line-height:22px;
					position:relative;
					
					&::before{
						content:'';
						display:block;
						position:absolute;
						top:32px;
						left:5px;
						width:5px;
						height:17px;
						background-color:#ffe266;
					}
        }
      }
      .module-content {
        .community-item {
          margin-top: 25px;
        }

        &.h5-code {
          padding: 0 20px;
          /*font-size: 15px;*/
          word-wrap: break-word;
          width: 100%;
          box-sizing: border-box;

          & img {
            max-width: 100% !important;
            margin: 0 auto;
          }
        }

        .attempt_list {
          display: flex;
          flex-direction: column;
          margin: 15px 15px 15px 20px;
        }
        .attempt_block {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          height:40px;
          margin-bottom: 30px;
          .blo_left {
            width:70px;
            height:39px;
            border-radius:3px;

          }
          .blo_center {
            flex: 1;
            margin: 0 15px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            color: rgba(53,64,72,1);
            line-height: 18px;
            .setEllipsisLn()
          }
          .blo_right {
            width: 36px;
            height: 22px;
            background: rgba(255,255,255,1);
            border-radius: 3px;
            border: 0.5px solid rgba(188,188,188,1);
            text-align: center;
            font-size: 12px;
            font-family: PingFangSC-Light;
            color: rgba(146,146,146,1);
            line-height: 22px;
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
      /*flex: 0 0 auto;*/
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 49px;
      /*position: relative;*/
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
        	/*color: #354048;*/
          display: block;
          margin-top: 1px;
        }
        & span:first-of-type {
          margin-top: 0;
          font-size: 16px;
					line-height:20px;
        }

        &.free-btn {
          color: #d7ab70;
          background-color: #ffffff;
					/*bing-增加*/
					flex-grow:1;
					//width:150px;
          padding: 0 20px;
					& span:nth-of-type(2){
						font-size:12px;
						line-height:16px;
					}
          & span:nth-of-type(1){
          }
					/*bing-增加*/
        }
        &.pay-btn {
					width:225px;
          color: #354048;
          background-color: #ffe266;
          & span:not(:first-of-type) {
            color: rgba(53, 64, 72, 0.8);
          }
					flex-grow:1;
        }
        &.free-btn-disable {
          padding: 0 20px;
        }
        &.free-btn-disable, &.pay-btn-disable {
          color: #bcbcbc;
          & span:nth-of-type(2){
            font-size:12px;
            line-height:16px;
          }
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
