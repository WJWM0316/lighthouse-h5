<template>
  <!--加入按钮-->
  <div class="payment" v-if="pageInfo">
    <!--非训练营加入按钮-->
    <div class="footer" v-if="pageInfo.isCourse !== 4">
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
          <span v-if="pageInfo.selectCoupon">用券省 
            <span class="coupon_price" v-if="pageInfo.selectCoupon.userCoupon.coupon.discount<pageInfo.joinPrice">{{pageInfo.selectCoupon.userCoupon.coupon.discount}}</span> 
            <span class="coupon_price" v-else>{{pageInfo.joinPrice}}</span> 元
          </span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="freeJoin" v-if="pageInfo.payJoinNum > 0 && pageInfo.joinPrice === 0">
          <span>免费加入</span>
        </div>
      </div>
    </div>
    <!--训练营加入按钮-->
    <div class="footer" v-if="pageInfo.isCourse === 4">
      <p class="nextCamp" v-if="isPassTime && pageInfo.nextCommunityId" @click.stop="nextCamp">本期报名已结束，下一期已开启，点击查看</p>
      <p class="nextCamp" v-else-if="pageInfo.remainingJoinNum <= 0 && pageInfo.nextCommunityId" @click.stop="nextCamp">已满员，下一期已开启，点击查看</p>
      <p v-else-if="isPassTime && !pageInfo.nextCommunityId">报名已结束</p>
      <p v-else-if="pageInfo.remainingJoinNum <= 0 && !pageInfo.nextCommunityId">已满员</p>
      <div class="btn-box" v-else>
        <div class="free-btn advisory" v-if="pageInfo.consultantLink || pageInfo.consultant_link" @click="toAdvisory(pageInfo.consultantLink)">
          <img src="../../assets/icon/icon_advisory@3x.png" />
          <span>咨询</span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="payOrFree" v-if="pageInfo.payJoinNum > 0 && pageInfo.joinPrice > 0">
          <span>付费加入:¥{{pageInfo.joinPrice}}</span>
          <span v-if="pageInfo.selectCoupon">用券省 
            <span class="coupon_price" v-if="pageInfo.selectCoupon.userCoupon.coupon.discount<pageInfo.joinPrice">{{pageInfo.selectCoupon.userCoupon.coupon.discount}}</span> 
            <span class="coupon_price" v-else>{{pageInfo.joinPrice}}</span> 元
          </span>
        </div>
        <div :class="{'pay-btn': isPayBtn, 'pay-btn-disable': !isPayBtn}"
                :disabled="!isPayBtn" @click="freeJoin" v-if="pageInfo.payJoinNum > 0 && pageInfo.joinPrice === 0">
          <span>免费加入</span>
        </div>
      </div>
    </div>
    <div class="guideImgBox" @click="closeGuide" v-if="join || advisory">
      <img @click.stop="disableJoin" v-if="join && pageInfo.remainingJoinNum > 0 && !this.isPassTime" class="join" src="../../assets/icon/pic_guide_06_2@3x.png" alt="" />
      <img @click.stop="disableAdvisory" v-if="advisory && pageInfo.consultantLink && pageInfo.remainingJoinNum > 0 && !this.isPassTime" class="advisoryImg" src="../../assets/icon/pic_guide_06_1@3x.png" alt="" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import localstorage from '@/util/localstorage/index'
@Component({
  name: 'payment',
  props: {
    /* 课程对象 */
    pageInfo: {
      type: Object
    }
  },
  computed: {
    /* 是否错过训练营可加入时间错过为true 没错过为false */
    isPassTime () {
      return this.pageInfo.remainDays <= 0
    }
  },
  watch: {
    pageInfo (newData, oldData) {
      let isNewUser = localStorage.getItem("isNewUser");
      console.log(!isNewUser, !this.isPassTime)
      if (!isNewUser && !this.isPassTime && newData.remainingJoinNum > 0 && newData.consultantLink) {
        this.advisory = true
        localStorage.setItem("isNewUser", true)
      }
      
      this.isJoinAgency = newData.isAuthor || newData.isJoined
      // 剩余免费名额
      this.freeSurplusPeople = parseInt(newData.freeJoinNum) - parseInt(newData.freeJoinedNum)
      // 剩余付费名额
      this.paySurplusPeople = parseInt(newData.payJoinNum) - parseInt(newData.payJoinedNum)
      this.isFreeBtn = this.freeSurplusPeople > 0
      this.isPayBtn = this.paySurplusPeople > 0
    }
  }
})
export default class payment extends Vue {
  isJoinAgency = null
  isFreeBtn = true
  isPayBtn = true
  freeSurplusPeople = null
  paySurplusPeople = null
  join = false //控制加入引导图
  advisory = false // 控制咨询引导图
  /*isCourse = 课程类型1.2旧课程，3新课程，4训练营 */
  /* 跳转咨询链接 */
  toAdvisory (Link) {
    if (Link) {
      window.location.href = Link
    } else {
      window.location.href = this.pageInfo.consultant_link 
    }
  }
  freeIn () {
    this.$emit('freeIn')
  }
  payOrFree () {
    this.$emit('payOrFree')
  }
  freeJoin () {
    this.$emit('freeJoin')
  }
  nextCamp () {
    if (this.pageInfo.nextJoined === 1) {
      this.$router.push(`/introduce2/${this.pageInfo.nextCommunityId}/community`)
    } else {
      this.$router.push(`/introduce2/${this.pageInfo.nextCommunityId}`)
    }
    
  }
  disableJoin () {
    this.join = false
  }
  disableAdvisory () {
    this.advisory = false
    this.join = true
  }
  closeGuide () {
    if (this.advisory) {
      this.advisory = false
      this.join = true
    } else {
      this.join = false
    }
  }
  created () {}
}
</script>

<style lang="less" scoped="scoped">
  @import "../../styles/variables";
  @import "../../styles/mixins";
  @import "../../styles/dprPx";
  .payment {
    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 49px;
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #bcbcbc;
      z-index: 999;
      .fontSize(15);
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
        .pay-btn {
          width: 225px;
          color: #354048;
          background-color: #ffe266;
          & span:not(:first-of-type) {
            color: rgba(53, 64, 72, 0.8);
          }
          span:nth-child(2) {
            .coupon_price {
              display: inline-block;
              .fontSize(12);
              line-height: 16px;
              color: #FB7A37;
            }
          }
          flex-grow:1;
          & .userCoupon {
            .fontSize(12);
          }
        }
      }
      & .to-home {
        flex: 0 0 auto;
        width: 52px;
        height: 100%;
        border-top: solid 1px #dcdcdc;/* no */
        border-right: solid 1px #ededed;/* no */
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: #929292;
        background-color: #ffffff;
        &>span {
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
        .fontSize(13);
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        border-style: none;
        border-radius: 0;
        border-top: solid 1px #dcdcdc;/* no */
        &:after {
          border-style: none;
        }
        & span {
          display: block;
          margin-top: 1px;
        }
        & span:first-of-type {
          margin-top: 0;
          .fontSize(16);
          line-height: 20px;
        }
        &.free-btn {
          color: #d7ab70;
          background-color: #ffffff;
          flex-grow: 1;
          padding: 0 20px;
          & span:nth-of-type(2) {
            .fontSize(12);
            line-height: 16px;
          }
        }
        /* 咨询按钮 */
        .advisory{
          box-sizing: border-box;
          display: flex;
          flex-flow: initial;
          align-items: center;
          justify-content: center;
          img{
            width: 25px;
            height: 25px;
            margin-right: 5px;
          }
        }
        &.pay-btn {
          width: 225px;
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
        &.free-btn-disable,
        &.pay-btn-disable {
          color: #bcbcbc;
          & span:nth-of-type(2) {
            .fontSize(12);
            line-height: 16px;
          }
        }
      }
      .nextCamp{
        border-top: 1px solid #DCDCDC;/*no*/
        height: 100%;
        line-height: 49px;
        background: #FFFFFF;
        font-size: 15px;
        color: #D7AB70;
        font-weight: 400;
      }
    }
    .guideImgBox{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
    }
    .join{
      width: 164px;
      height: 97px;
      position: absolute;
      bottom: 50px;
      right: 15px;
    }
    .advisoryImg{
      position: absolute;
      width: 241px;
      height: 97px;
      bottom: 50px;
      left: 15px;
    }
  }
</style>