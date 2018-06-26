<template>
  <div class="coupon-item">
    <div class="item-bg" @click.stop="emitInfo">
    	<!--优惠券上半部-->
      <div class="top-part">
        <div class="left">
          <div class="coupon-title" :class="{'unavail':!item.available}">{{item.title}}</div>
          <div class="outtime" v-if="item.isNearlyOutTime && !item.isUse">即将过期</div>
          <div class="time-during">{{item.useStartTimeStr}} 至 {{item.useEndTimeStr}}</div>
        </div>
        <div class="right">
          <span :class="{'unavail': !item.available}">¥</span><span :class="{'unavail':!item.available}">{{item.creditAmount}}</span>
        </div>
      </div>
      <!--优惠券上半部-->
      <div class="border-sty"></div>
      <!--优惠券下半部-->
      <div class="bottom-part">
        <div class="left">{{item.instruction}}</div>
        <div class="right" v-if="!item.isChoose">
          <div :class="{'unavail':!item.available}">{{item.status}}</div>
          <iamge v-if="item.available" class="gloden-arrow" src="../../static/icon/btn_gloden_enter.png"/>
        </div>
        <div v-else class="select-circle" :class="{'selected-circle':item.isChecked}">
          <div class="circle-center"></div>
        </div>
      </div>
      <!--优惠券下半部-->
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  
    @Component({
		name:'coupon-item',
	     props:{
	      item: {
	        type: Object,
	        twoWay: true,
	        default: function () {
	          return {
	              couponId: '1',
		          title: '优惠劵名称',
		          creditAmount: 19.3,
		          instruction: '使用说明使用说明使用说明使用说明使用说明使用说明大沙发是的发送到发送到发斯蒂芬',
		          isUse: 0, // 0: 未使用 1：已使用
		          isOutTime: 0, // 0: 未过期，1：已过期
		          isNearlyOutTime: 1, // 0:未即到期，1:即将到期
		          useStartTime: 1388307215,
		          useEndTime: 1388307215,
		          useStartTimeStr: '2033-8-12', // 开始时间字符串
		          useEndTimeStr: '2088-3-20', // 结束时间字符串
		          status:'立即使用',
		          available:1,		//可以使用状态
		          isChoose:1,		//1：可以选择圆圈状态 ，0：文字状态
		          isChecked:1,		//0：未选中 ，1：选中
	          }
	        },
	        itemBg: {
		      	type:Object,
		      	default:function(){
		      		return 'http://cdnstatic.zike.com/Uploads/static/beacon/error_emp_coupon.png'
		      	}
		      }
	      },
	    },
	    computed:{
	      selectStyle () {
	        return this.isSelected ? 'select-circle' : 'selected-circle'
	      }
	    }
	})
    
	export default class couponItem extends Vue {
//	  emitInfo (e) { // 点击跳转个人详情
//      
//   },
	}
    

    
 
</script>

<style lang="less" scoped>
 @import "../../styles/mixins";
  .coupon-item {
  	margin-top:15px;
    width: 100%;
    .unavail{
      color: #929292!important;
    }
    .item-bg{
      margin: 0 auto;
      height: 132px;
      width: 355px;
      background: url('http://cdnstatic.zike.com/Uploads/static/beacon/coupon/bg_coupon.png') no-repeat;
      background-size: 355px 132px;
        .top-part {
          padding: 20px 18px 11px;
          display: flex;
          justify-content: space-between;
          .coupon-title {
            display: inline-block;
            color: #354048;
            font-size: 15px;
            max-width: 175px;
            font-weight: bold;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .outtime {
            font-size: 11px;
            display: inline-block;
            background-color: #ff3434;
            color: #fff;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin-left: 10px;
            margin-bottom: 2px;
            width: 54px;
            text-align: center;
          }
          .left{
            .time-during{
              color: #929292;
              font-size: 13px;
              font-weight: 300;
            }
          }
          .right{
            span{
              color: #fa6a30;
              &:nth-child(1){
                font-size: 13px;
              }
              &:nth-child(2){
                font-weight: bold;
                font-size: 23px;
              }

            }
          }
        }
        .border-sty{
          border-bottom: 1px solid #ededed;
          margin-left:15px;
          margin-right:15px;
        }
        .bottom-part{
          padding: 10px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            width: 223px;
            color: #929292;
            font-size: 13px;
            line-height: 17px;
            font-weight: 300;
          }
          .right{
            color: #d7ab70;
            font-size: 13px;
            display: flex;
            align-items: center;
            .gloden-arrow{
              width: 15px;
              height: 15px;
            }
          }
      }
    }
    .select-circle{
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #bcbcbc;
    }
    .selected-circle{
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #fa6a30;
      display: flex;
      justify-content: center;
      align-items: center;
      .circle-center{
        background: #fa6a30;
        border-radius: 50%;
        width: 14px;
        height: 14px;
      }
    }
  }
</style>
