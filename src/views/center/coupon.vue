<!--优惠券-->
<template>
	<div class='coupon-page' :class="{bgColor:true}">
		<div class="exchange-inp">
			<input type="text" placeholder="输入兑换码"/>
			<button class="btn-exchange" @click.stop="showResults">兑换</button>
		</div>
		<!--优惠券-->
		<div v-if="couponList.length>0">
			<CouponItem v-for="item in couponList" :item='item'></CouponItem>
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
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import CouponItem from '@/components/couponItem/couponItem'
	import {couponListApi} from '@/api/pages/pageInfo.js'
	@Component({
	  name: 'coupon-page',
	  components: {
	    CouponItem
	  }
	})
	export default class CenterCouponPage extends Vue {
		
		created(){
			let param={
				page:1,
				pageCount:20
			}
			this.getCouponList(param)
		}
		
		emptyImg = 'http://cdnstatic.zike.com/Uploads/static/beacon/coupon/error_emp_coupon.png'
		data(){
			return {
				couponList:[],
			}
		}
		
		showResults(){
			this.$vux.alert.show({
	          title: '兑换成功',
	          content: '快去使用优惠券吧～',
	          buttonText: '好的',
	          onHide () {
	          	console.log(this)
	          }
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
		background:rgba(255,226,102,1);
		border-radius:20px;
		outline: none;
		border: 0;
		font-size:15px;
		line-height:21px;
		color: #354048;
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