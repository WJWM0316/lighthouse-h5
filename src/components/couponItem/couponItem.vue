<template>
  <div class="coupon-item" @click.stop="selectCoupon">
    <div class="item-bg"> 
    	<!--优惠券上半部  @click.stop="emitInfo"-->
      <div class="top-part">
        <div class="left">
          <div class="coupon-title" :class="{'unavail':item.coupon.status!==1 || item.useState===1 || canOrcant===0}">
          	<!--全场通用名字-->
          	<span v-if="item.coupon.relationCommunity===null">全场通用优惠券</span>
          	<!--专属名字-->
          	<span v-else>{{item.coupon.relationCommunity.title}}优惠券</span>
          </div>
          <div class="outtime" v-show="item.isSoonPast===1">即将过期</div>
          <div class="time-during">{{item.coupon.useStartTime*1000 | date('YYYY-M-D')}} 至 {{item.coupon.useEndTime*1000 | date('YYYY-M-D')}}</div>
        </div>
        <div class="right">
          <span :class="{'unavail': item.coupon.status!==1 || item.useState===1 || canOrcant===0}">¥</span>
          <span :class="{'unavail':item.coupon.status!==1 || item.useState===1 || canOrcant===0}">{{item.coupon.discount}}</span>
        </div>
      </div>
      <!--优惠券上半部-->
      <div class="border-sty"></div>
      <!--优惠券下半部-->
      <div class="bottom-part">
        <div class="left">
        	<span v-if="item.coupon.relationCommunity">
        		<!--是否有门槛规则-->
        		<span v-if="item.coupon.demand===0">仅限“{{item.coupon.relationCommunity.title}}”可使用</span>
        		<span v-else>当灯塔价格满{{item.coupon.demand}}元时，仅限该灯塔可使用</span>
        	</span>
        	<span v-else>
        		<!--是否有门槛规则-->
        		<span v-if="item.coupon.demand===0">小灯塔内所有灯塔均可使用</span>
        		<span v-else>当灯塔价格满{{item.coupon.demand}}元时可以使用</span>
        	</span>
        </div>
        <div class="right" v-if="!isChoose" @click.stop="useConpon">
          <div :class="{'unavail':item.coupon.status!==1 || item.useState===1}" v-show="item.coupon.status===1 && item.useState===0">立即使用</div>
          <div :class="{'unavail':item.coupon.status!==1 || item.useState===1}" v-show="item.coupon.status===5 && item.useState===0">已过期</div>
          <div :class="{'unavail':item.coupon.status!==1 || item.useState===1}" v-show="item.coupon.status===4 && item.useState===0">未开始</div>
          <div :class="{'unavail':item.coupon.status!==1 || item.useState===1}" v-show="item.useState===1">已使用</div>
          <img v-show="item.coupon.status===1 && item.useState===0" class="gloden-arrow" src="../../assets/icon/btn_gloden_enter.png"/>
        </div>
        <!--支付选择圆点-->
        <div v-else class="select-circle" :class="{'selectedCircle':item.userCouponId===nowUseCoupon,'disable':canOrcant===0}">
          <div class="circleCenter"></div>
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
	        index:{
	        	type:Number,
	        	required: true
	        },
	        nowUseCoupon:{
	        	type:Number,
	        	required: true,
	        	default: 0
	        },
	        canOrcant:{
	        	type:Number,
	        	require:true
	        },
	        isChoose:{//true：可以选择圆圈状态 ，false：文字状态
	        	type:Boolean,
	        	require:true
	        }
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
	    isChecked = false			//是否被选择，默认为没选中
//	    nowCoupon= this.$parent.nowUseCoupon
//	    instruction = '使用说明使用说明使用说明使用说明使用说明使用说明大沙发是的发送到发送到发斯蒂芬'		//优惠券说明
//		  isChoose=this.$parent.isToPay 	//1：可以选择圆圈状态 ，0：文字状态
		  created(){
//		  	console.log(this.$parent.$parent,"1111111111111111111111111111111111111")
		  }
		  useConpon(){
		  	if(this.item.coupon.status===1 && this.item.useState===0){
		  		if(this.item.coupon.relationCommunity){
			  		console.log(this.item.coupon.relationCommunity.title,"我是专用券。。。。")
			  		this.$router.push(`/introduce/${this.item.coupon.relationCommunity.communityId}?reload=true`)
			  	}else{
			  		console.log("我是通用券。。。")
			  		this.$router.replace(`/index`)
			  	}
		  	}
		  }
		  //选择优惠券
		  selectCoupon(){
		  	if(this.isChoose && this.canOrcant===1){
		  		this.isChecked = true
		  		console.log(this.item.coupon.couponId,"我是优惠券的id。。。。。。。")
		  		this.$parent.nowUseCoupon=this.item.userCouponId;
		  		sessionStorage.setItem("coupon",JSON.stringify(this.item))
		  		this.$router.go(-1)
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
  	margin-top:5px;
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
          padding: 20px 21.5px 11px;
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
          border-bottom: 0.5px solid #ededed;
          margin-left:15px;
          margin-right:15px;
        }
        .bottom-part{
          padding: 8px 21.5px 12px;
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
    .disable{
    	display: none;
    }
    .selectedCircle{
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #fa6a30;
      display: flex;
      justify-content: center;
      align-items: center;
      .circleCenter{
        background: #fa6a30;
        border-radius: 50%;
        width: 14px;
        height: 14px;
      }
    }
  }
</style>
