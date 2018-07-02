<!--优惠券-->
<template>
	<div class='coupon-page' :class="{bgColor:true}">
		<div class="exchange-inp">
			<input type="text" v-model="val" placeholder="输入兑换码"/>
			<button class="btn-exchange" :class="{inputBtn:val.length>0}" @click.stop="showResults">兑换</button>
		</div>
		<!--优惠券-->
		<div v-if="couponList.length>0"  v-for="item in couponList">
			<CouponItem :item='item'></CouponItem>
		</div>

		<!--<CouponItem></CouponItem>-->
		<!--没有优惠券-->
		<div class="empty-part" v-else>
	      <img :src="emptyImg" class="empty-img"/>
	      <div class="empty-tip">暂无优惠券哦～</div>
	  </div>
	    <!--没有优惠券-->
	</div>
</template>

<script>
	var isTopay;
	var communityId;
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import CouponItem from '@/components/couponItem/couponItem'
	import { couponListApi,RedemptionCodeApi,canUseCouponsApi } from '@/api/pages/pageInfo.js'
	
	Component.registerHooks([
	  'beforeRouteEnter',
	  'beforeRouteLeave',
	  'beforeRouteUpdate' // for vue-router 2.2+
	])
	
	@Component({
	  name: 'coupon-page',
	  components: {
	    CouponItem
	  },
//	  watch:{
//	  	'val'(newval,oldval){
//	  		console.log(newval,oldval,"我是输入框的val")
//	  	}
//	  }
	})
	
	export default class CenterCouponPage extends Vue {
		couponList = []		//存放优惠券列表
		val = ''			//输入框值
		content = ''
		isToPay = isTopay
		
		beforeRouteEnter(to,from,next){
			console.log(from,"woshilaide lu")
			if(from.name==="introduce"){
				communityId = from.params.communityId;
				isTopay = true;
			}else{
				isTopay = false;
				communityId = '';
			}
			next();
		}
		
		created(){
			let param={
				page:1,
				pageCount:20,
				productId:communityId
			}
			if(this.isToPay){
				this.getCanUseCouponList(param)
			}else{
				this.getCouponList(param)
			}
		}
		
		emptyImg = 'http://cdnstatic.zike.com/Uploads/static/beacon/coupon/error_emp_coupon.png'
//		data(){
//			return {
//				couponList:[],
//				val:'',
//			}
//		}
		
		showResults(){
			console.log(this.val,"我是优惠券兑换码。。。。。")
			RedemptionCodeApi(this.val).then(res=>{
				//兑换成功
				this.$vux.alert.show({
          title: '兑换成功',
          content: '快去使用优惠券吧～',
          buttonText: '好的',
          onHide () {
//        	console.log(this)
          }
        })
				
			}).catch(res=>{
				let that = this
				let content = "快去使用优惠券吧～"
				//兑换失败
				this.$vux.alert.show({
          title: '兑换失败',
          content: content,
          buttonText: '好的',
          onHide () {
          	
          }
        })
			})
			
		}
		//请求优惠券列表
		getCouponList(param){
			couponListApi(param).then(res=>{
				
				let {userCoupons} = res;
				this.couponList=userCoupons;
				console.log(res,this.couponList,"我是正确信息")
			}).catch(res=>{
				console.log(res,"我是错误信息")
			})
		}
		
		//请求支付页面可使用优惠券列表
		getCanUseCouponList(param){
			canUseCouponsApi(param).then(res=>{
				let newList=[];
				for(let i=0; i<res.selectCoupons.length;i++){
					newList.push(res.selectCoupons.userCoupon)
				}
//				let {userCoupons} = res.selectCoupons;
				this.couponList=res.selectCoupons;
				console.log(newList,this.couponList,"我是正确信息")
			}).catch(res=>{
				console.log(res,"我是错误信息")
			})
		}
		
		
	}
</script>

<style lang="less" scoped>
  .position-empty{
    height: 24px;
  }
  .coupon-page{
    background: #FFFFFF;
    height: 100%;
    &.bgColor{
    	/*background-color: #F8F8F8;*/
    }
    
    /*兑换输入框*/
   .exchange-inp{
   	width: 100%;
   	height: 49px;
   	background-color: #FFFFFF;
   	padding: 0 15px;
   	box-sizing: border-box;
   	display: flex;
   	align-items: center;
   	input{
   		width:265px;
   		height: 34px;
   		box-sizing: border-box;
   		padding: 0 20px;
   		border: 1px solid #DCDCDC;
   		border-radius: 20px;
   		margin-right: 10px;
   		color: #354048;
   		&::placeholder{
   			color: #BCBCBC;
   		}
   	}
   	.btn-exchange{
   		width:70px;
		height:34px;
		background:rgba(248,248,248,1);
		/*background:rgba(255,226,102,1);*/
		border-radius:20px;
		outline: none;
		border: 0;
		font-size:15px;
		line-height:21px;
		color:rgba(188,188,188,1);
   	}
   	.inputBtn{
   		background:rgba(255,226,102,1) !important;
   		color:rgba(53,64,72,1) !important;
   	}
   }
    
    .coupon-item{
      margin-bottom: 5px;
    }
    .empty-part{
      text-align: center;
      padding-top: 105px;
      .empty-img{
        width: 162px;
        height: 128px;
      }
      .empty-tip{
        margin-top: 15px;
        font-size: 15px;
        text-align: center;
        color: #bcbcbc;
      }
    }
  }
</style>