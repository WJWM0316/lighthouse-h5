<!--优惠券-->
<template>
	<div class='coupon-page' :class="{bgColor:false}">
		<div class="exchange-inp">
			<input type="text" v-model="val" placeholder="输入兑换码"/>
			<button class="btn-exchange" :class="{inputBtn:val.length>0}" @click.stop="showResults">兑换</button>
		</div>
		
		<div class="noUse">
			<span class="noUseTxt">不使用优惠券</span>
			<div class="cir sel-cir">
				<div class="cir-center"></div>
			</div>
		</div>
		<!--优惠券-->
		<div v-if="couponList.length>0"  v-for="(item,index) in couponList">
			<CouponItem :item='item' :index='index' :nowUseCoupon='nowUseCoupon'></CouponItem>
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
	let isTopay;
	let communityId;
	let nowUseCoupon1 = 0;
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
		nowUseCoupon = nowUseCoupon1
		
		beforeRouteEnter(to,from,next){
			console.log(from,to,"woshilaide lu")
			if(from.name==="introduce" || to.query.userCouponId){
				communityId = to.query.communityId;
				nowUseCoupon1 = parseInt(to.query.userCouponId);
				isTopay = true;
				console.log(to.query.couponId)
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
				productId:communityId,
				userCouponId:nowUseCoupon1
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
					newList.push(res.selectCoupons[i].userCoupon)
				}
//				let {userCoupons} = res.selectCoupons;
				this.couponList=newList;
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
    
    /*不使用优惠券*/
   .noUse{
   	box-sizing: border-box;
   	margin: 0 auto;
   	margin-top: 15px;
   	width: 350px;
   	height: 60px;
   	display: flex;
   	justify-content: space-between;
   	align-items: center;
		box-shadow:0px 2px 5px 0px rgba(0,0,0,0.06);
		border-radius:8px;
		border:1px solid rgba(237,237,237,1);
		padding-right: 20px;
		padding-left: 15px;
   	.noUseTxt{
   		font-weight: 700;
   		font-size:15px;
			color:rgba(53,64,72,1);
			line-height:21px;
   	}
   	/*圆圈*/
   	.cir{
   		width:18px;
			height:18px;
			border:1px solid rgba(188,188,188,1);
			border-radius: 50%;
   	}
   	.sel-cir{
      border: 1px solid #fa6a30;
      display: flex;
      justify-content: center;
      align-items: center;
      >.cir-center{
        background: #fa6a30;
        border-radius: 50%;
        width: 14px;
        height: 14px;
      }
   	}
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