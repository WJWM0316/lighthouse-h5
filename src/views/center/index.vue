<template>
  <div class="p-body p-center-index">
    <app-guide class="guide" :isToGuide="true"></app-guide>
    <div class="header">
      <div class="left">
        <p class="username">{{model.realName}}</p>
        <p class="job-info">
          {{model.workTimeName}}
          <template v-if="model.workTimeName && (model.career || model.office)"> | </template>
          {{model.career}}
          <template v-if="model.career && model.office"> | </template>
          {{model.office}}
        </p>
        <router-link class="edit-btn" to="/center/editinfo">点击编辑资料</router-link>
      </div>
      <div class="right">
        <image-item class="head" mode="horizontal" :src="model.avatarUrl || require('@/assets/icon/img_head_default.png')" />
      </div>
    </div>


    <ul class="center_nav">
      <li class="" @click="navTo('home')">
        <img src="./../../assets/page/empty.png" alt="">
        <div class="">我的主页</div>
      </li>
      <li class="" @click="navTo('joined')">
        <img src="./../../assets/page/empty.png" alt="">
        <div class="">我的课程</div>
      </li>
      <li class="" @click="navTo('message')">
        <img src="./../../assets/page/empty.png" alt="">
        <div class="">我的消息</div>
      </li>
    </ul>
    <div class="navs">
      <!-- <router-link to="/joined" class="item">
        <div class="left">
          <i class="icon u-icon-center-light" />
          <span class="title">我加入的灯塔</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </router-link> -->
      <router-link :to="model.isCommunity === 1 ? '/center/liteCenter' : '/center/createLite'" class="item">
        <div class="left">
          <i class="icon u-icon-center-create" />
          <span class="title">{{model.isCommunity === 1 ? '塔主中心' : '创建我的灯塔'}}</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </router-link>
      <router-link to="/center/rewards" class="item">
        <div class="left">
          <i class="icon u-icon-center-reward" />
          <span class="title">现金奖励</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </router-link>
      <!--优惠券-->
      <router-link to="/center/coupon" class="item">
        <div class="left">
          <i class="icon u-icon-center-coupon" />
          <span class="title">优惠券</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
          <span class="soonPsat" v-if="model.hasSoonPastCoupon">有即将过期的优惠券</span>
          <span class="redTip" :class="{'redTipMove':model.hasSoonPastCoupon}"  v-if="model.hasCouponRedDot"></span>
        </div>
      </router-link>
      <!--我的主页-->
      <!-- <router-link :to="`/userInfo/${model.userId}/details`" class="item">
        <div class="left">
          <i class="icon u-icon-center-home" />
          <span class="title">我的主页</span>
        </div>
        <div class="addon">
          <i class="addon-icon u-icon-center-angle-right" />
        </div>
      </router-link> -->

      <div class="navs_blo">
        <router-link :to="`/center/help`" class="blo_item">
            <span class="title">使用帮助</span>
        </router-link>
        <router-link :to="`/center/protocol`" class="blo_item">
            <span class="title">用户协议</span>
        </router-link>
      </div>
    </div>

  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import appGuide from '@/components/appGuide/appGuide'
import { getInformationApi } from '@/api/pages/center'

@Component({
  name: 'center-index',
  components: {
    appGuide
  }
})
export default class HomeIndex extends Vue {
  model = {
  }
  isCreated = false // 是否已经成为塔主

  created () {
    
    this.getModel()
  }

  async getModel () {
    try {
      this.model = await getInformationApi()
    } catch (error) {
      this.$vux.toast.text(error.message, 'bottom')
    }
  }

  navTo (type) {
    console.log(type)
    this.$router.push({name: type})
  }

  /**
   * 创建灯塔
   */
  handleCreate () {
    //this.$router.push({name: 'center-create'})
    this.$vux.alert.show({
      title: '创建灯塔请联系',
      content: '小灯塔客服：020-28163063或添加客服微信：zike03',
      buttonText: '好的'
    })
  }
}
</script>
<!--  -->
<style lang="less"  type="text/less">
@import "../../styles/variables";
@import "../../styles/mixins";
.center_nav {
  width: 330px;
  height: 78px;
  background: rgba(255,255,255,1);
  box-shadow: 0px 8px 26px 0px rgba(169,166,151,0.16);
  border-radius: 3px;
  margin: auto;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  li {
    height: 78px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size:12px;
    font-family:PingFangSC-Light;
    font-weight:300;
    color:rgba(102,102,102,1);
    line-height:16px;
    img {
      width:24px;
      margin: 0 auto;
      height:24px;
      margin-bottom: 6px;
    }
  }
}

.u-icon-center-light {
  background-image: url("../../assets/icon/icon_list_aboutlh@3x.png");
  width: 20px;
  height: 20px;
}
.navs_blo {
  height:20px;
  text-align: center;
  margin: 25px 0 0px 0;
  display: flex;
  justify-content: center;
  .blo_item {
    font-family: PingFangSC-Light;
    font-weight: 300;
    color: rgba(188,188,188,1);
    line-height:20px;
    font-size:13px;
    position: relative;
    &:first-of-type {
      margin-right: 40px;

      &::before {
        content: '';
        width: 1px;
        height: 18px;
        border-radius: 22px;
        background: rgba(220,220,220,1);
        position: absolute;
        right: -20px;
        top: 1px;
      }
    } 
  }
}
.p-body{
	padding-bottom: 53px;
}

.p-center-index {
  .header {
      .setFlex();
      padding: 30px;
      line-height: 23px;
      font-size: 13px;

      .left {
        flex: 1 1 auto;

        .username {
          display: block;
          line-height: 26px;
          font-size: 20px;
          font-weight: bold;
        }

        .job-info {
          display: block;
          margin-bottom: 9px;
          color: #929292;
          .setEllipsisLn(1);
        }

        .edit-btn {
          display: inline-block;
          line-height: 19px;
          color: #d7ab70;
        }
      }

      .right {
        flex: 0 0 auto;
        font-size: 0;
        line-height: 1;

        .head {
          // background: #ccc;
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
    }

    .navs {
      padding-bottom: 30px;
      .item {
        .setFlex();
        padding: 20px 30px;
        line-height: 20px;
        font-size: 15px;
        color: @font-color-default;

        &:active {
          background: #f1f1f1;
        }

        .left {
          flex: 1 1 auto;

          .icon,
          .title {
            vertical-align: middle;
          }

          .icon {
            position: static;
            top: auto;
          }

          .title {
            display: inline-block;
            padding: 0 15px;
          }
        }

        .addon {
        	position: relative;
          flex: 0 0 auto;

          .addon-icon {
            position: static;
            top: auto;
            vertical-align: middle;
          }
          /*即将过期*/
          .soonPsat{
          	position: absolute;
          	top: 50%;
          	right: 19px;
          	transform: translateY(-50%);
          	white-space: nowrap;
						font-size:13px;
						color:rgba(188,188,188,1);
         	}
         	/*红点*/
         	.redTip{
         		position: absolute;
         		top: 50%;
         		right: 21px;
         		transform: translateY(-50%);
         		width: 6px;
         		height: 6px;
         		border-radius: 50%;
         		background-color: #FF3434;
         	}
         	.redTipMove{
         		right: 144px;
         	}
        }
      }
    }
}
</style>
