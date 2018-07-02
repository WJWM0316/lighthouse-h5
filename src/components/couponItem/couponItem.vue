<template>
  <div class="coupon-item">
    <div class="item-bg"> 
    	<!--优惠券上半部  @click.stop="emitInfo"-->
      <div class="top-part">
        <div class="left">
          <div class="coupon-title" :class="{'unavail':item.coupon.status!==1}">{{item.coupon.title}}</div>
          <div class="outtime" v-show="item.isSoonPast===1">即将过期</div>
          <div class="time-during">{{item.coupon.useStartTime*1000 | date('YYYY-M-D')}} 至 {{item.coupon.useEndTime*1000 | date('YYYY-M-D')}}</div>
        </div>
        <div class="right">
          <span :class="{'unavail': item.coupon.status!==1}">¥</span><span :class="{'unavail':item.coupon.status!==1}">{{item.coupon.discount}}</span>
        </div>
      </div>
      <!--优惠券上半部-->
      <div class="border-sty"></div>
      <!--优惠券下半部-->
      <div class="bottom-part">
        <div class="left">
        	<span v-show="item.coupon.relationCommunity">仅“{{item.coupon.relationCommunity.title}}”可使用</span>
        </div>
        <div class="right" v-if="!isChoose" @click.stop="useConpon">
          <div :class="{'unavail':item.coupon.status!==1}" v-show="item.coupon.status===1">立即使用</div>
          <div :class="{'unavail':item.coupon.status!==1}" v-show="item.coupon.status!==1">已过期</div>
          <img v-show="item.coupon.status===1" class="gloden-arrow" src="../../assets/icon/btn_gloden_enter.png"/>
        </div>
        <!--支付选择圆点-->
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
	        required: true
//	        default: function () {
//	          return {
//	            couponId: '1',			//优惠券id
//		          title: '优惠劵名称',			//优惠券名称
//		          discount: 19.3,		//折扣金额
//		          instruction: '使用说明使用说明使用说明使用说明使用说明使用说明大沙发是的发送到发送到发斯蒂芬',		//优惠券说明
//		          isUse: 0, // 0: 未使用 1：已使用
//		          isOutTime: 0, // 0: 未过期，1：已过期
//		          isNearlyOutTime: 1, // 0:未即到期，1:即将到期
//		          useStartTime: 1388307215,			//优惠券开始时间戳
//		          useEndTime: 1388307215,				//优惠券结束时间戳
//		          status:'立即使用',
//		          available:1,		//可以使用状态
//		          isChoose:0,		//1：可以选择圆圈状态 ，0：文字状态
//		          isChecked:1,		//0：未选中 ，1：选中
//							}
//	          }
	        },
//	        itemBg: {
//		      	type:Object,
//		      	default:function(){
//		      		return 'http://cdnstatic.zike.com/Uploads/static/beacon/error_emp_coupon.png'
//		      	}
//		      }
	     },
	    computed:{
	      selectStyle () {
	        return this.isSelected ? 'select-circle' : 'selected-circle'
	      }
	    },
	})
    
	export default class couponItem extends Vue {
	    itemBg = 'http://cdnstatic.zike.com/Uploads/static/beacon/error_emp_coupon.png'
//	    instruction = '使用说明使用说明使用说明使用说明使用说明使用说明大沙发是的发送到发送到发斯蒂芬'		//优惠券说明
		  isChoose=0 	//1：可以选择圆圈状态 ，0：文字状态
		  useConpon(){
		  	
		  	if(this.item.coupon.relationCommunity){
		  		console.log(this.item.coupon.relationCommunity.title,"我是专用券。。。。")
		  		this.$router.push(`/introduce/${this.item.coupon.relationCommunity.communityId}?reload=true`)
		  	}else{
		  		console.log("我是通用券。。。")
		  		this.$router.replace(`/index`)
		  	}
		  }
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
          padding: 8px 18px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 34px;
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
