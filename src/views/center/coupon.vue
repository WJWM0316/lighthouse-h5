<!--优惠券-->
<template>
	<div class='coupon-page' :class="{bgColor:couponList.length>0}">
		<scroll  :pullupable="false" :refreshable="false" :infinite-scroll="true" @infinite-scroll="handlePullup" :is-none-data="couponList.length===listLength" :show-bottom-loading='!isToPay'>
	
		<div class="exchange-inp">
			<input type="text" v-model="val" placeholder="输入兑换码"/>
			<button class="btn-exchange" :class="{inputBtn:val.length>0}" @click.stop="showResults">兑换</button>
		</div>
		
		<div class="noUse" @click.stop="noUseCoupon" v-if="isToPay">
			<span class="noUseTxt">不使用优惠券</span>
			<div class="cir" :class="{selCir:nowUseCoupon===0}">
				<div :class="{cirCenter:nowUseCoupon===0}"></div>
			</div>
		</div>
		<!--优惠券-->
		<div v-if="couponList.length>0"  v-for="(item,index) in couponList">
			<CouponItem :item='item' :index='index' :nowUseCoupon='nowUseCoupon' :canOrcant='1' :isChoose="isToPay"></CouponItem>
		</div>
		
		<div class="invalidCoupon" v-if="isToPay && listLength===couponList.length" @click.stop="toinvalidCoupon">
			没有更多的可用优惠卷了 | 查看不可用优惠卷 >>
		</div>
		</scroll>

		<!--<CouponItem></CouponItem>-->
		<!--没有优惠券-->
		<div class="empty-part" v-if="couponList.length<=0">
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
	import Scroll from '@/components/scroller'
	import { couponListApi,RedemptionCodeApi,canUseCouponsApi } from '@/api/pages/pageInfo.js'
	
	Component.registerHooks([
	  'beforeRouteEnter',
	  'beforeRouteLeave',
	  'beforeRouteUpdate' // for vue-router 2.2+
	])
	
	@Component({
	  name: 'coupon-page',
	  components: {
	    CouponItem,
	    Scroll
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
		listLength = 0
		page = 1
		
		beforeRouteEnter(to,from,next){
			console.log(from,to,"woshilaide lu")
			if(to.query.communityId){
				communityId = to.query.communityId;
				nowUseCoupon1 = parseInt(to.query.userCouponId);
				isTopay = true;
			}else{
				isTopay = false;
				communityId = '';
			}
			next();
		}
		
		created(){
			let param={
				page:this.page,
				pageCount:20,
				productId:communityId,
				userCouponId:nowUseCoupon1
			}
			if(this.isToPay){
				document.querySelector('title').innerHTML = "选择优惠券"
				this.getCanUseCouponList(param)
				console.log(this.couponList.length,"数组的长度。。。。。。")
			}else{
				document.querySelector('title').innerHTML = "优惠券";
				this.getCouponList(param)
			}
		}
		
		emptyImg = 'http://cdnstatic.zike.com/Uploads/static/beacon/coupon/error_emp_coupon.png'
		
		//兑换优惠券
		showResults(){
			
			RedemptionCodeApi(this.val).then(res=>{
				let that = this;
				//兑换成功
				this.$vux.alert.show({
          title: '兑换成功',
          content: '快去使用优惠券吧～',
          buttonText: '好的',
          onHide () {
          	let param={
							page:1,
							pageCount:20,
							productId:communityId,
							userCouponId:nowUseCoupon1
						}
						if(that.isToPay){
							that.getCanUseCouponList(param)
							console.log(that.couponList.length,"数组的长度。。。。。。")
						}else{
							that.getCouponList(param)
						}
//        	console.log("这个是点击好的后触发的。。。。。")
          }
        })
				
			}).catch(res=>{
				console.log(this.val,"我是优惠券兑换码。。。。。")
				let that = this
				let content,title;
				switch(res.statusCode){
					case 424:
						title = '兑换码已失效'
						content = '不要伤心啦，持续关注我们 还会有更多优惠哦！'
						break;
					case 423:
						title = '兑换失败'
						content = '该兑换码已经被兑换啦～'
						break;
					case 422:
						title = '兑换码错误'
						content = '看看有没有数错哦～'
						break;
					case 421:
						title = '兑换失败'
						content = '来晚了，优惠券已经兑换完了~'
						break;
					default :
						title = '兑换失败'
						content = '未知错误'
						break;
				}
				//兑换失败
				this.$vux.alert.show({
          title: title,
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
				this.listLength = res.total;
				let {userCoupons} = res;
				
				if(this.page>1){
					this.couponList = this.couponList.concat(userCoupons || [])
				}else{
					this.couponList=userCoupons;
				}
			
				console.log(this.listLength,this.page,"我是正确信息")
			}).catch(res=>{
				console.log(res,"我是错误信息")
			})
		}
		
		//请求支付页面可使用优惠券列表
		getCanUseCouponList(param){
			canUseCouponsApi(param).then(res=>{
				this.listLength = res.total;
				let newList=[];
				for(let i=0; i<res.selectCoupons.length;i++){
					newList.push(res.selectCoupons[i].userCoupon)
				}
				
				if(this.page>1){
					this.couponList = this.couponList.concat(newList || [])
				}else{
					this.couponList=newList;
				}
				
				console.log("请求数据成功")
			}).catch(res=>{
				console.log(res,"我是错误信息")
			})
		}
		
		//不使用优惠券
		noUseCoupon(){
			console.log("不使用优惠券")
			this.nowUseCoupon=0;
			let noUseCoupon={userCouponId:0}
			sessionStorage.setItem("coupon",JSON.stringify(noUseCoupon))
  		this.$router.go(-1)
		}
		
		//去查看无法使用优惠券列表
		toinvalidCoupon(){
			this.$router.push({path:'/center/invalidCoupon',query:{communityId:communityId}});
		}
		
		
		async handlePullup (loaded) {
			if(this.couponList.length===this.listLength){
				loaded('ended')
			}else{
				this.page+=1;
				let param={
					page:this.page,
					pageCount:20,
					productId:communityId,
					userCouponId:nowUseCoupon1
				}
				if(this.isToPay){
					this.getCanUseCouponList(param)
				}else{
					this.getCouponList(param)
				}
				loaded('done')
			}
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
    	background-color: #F8F8F8;
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
		border-radius:4px;
		border:1px solid rgba(237,237,237,1);
		padding-right: 20px;
		padding-left: 15px;
		background-color: #FFFFFF;
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
   	.selCir{
      border: 1px solid #fa6a30;
      display: flex;
      justify-content: center;
      align-items: center;
      >.cirCenter{
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
   	margin-bottom: 10px;
   	input{
   		width:265px;
   		height: 34px;
   		box-sizing: border-box;
   		padding: 0 20px;
   		border: 0.5px solid #DCDCDC;
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
    
    /*不可用优惠券查看文字*/
   	.invalidCoupon{
   		display: flex;
   		justify-content: center;
   		align-items: center;
   		padding-top: 25px;
   		padding-bottom: 25px;
   		font-weight: 300;
   		font-size:12px;
			color:rgba(146,146,146,1);
   	}
  }
  .u-bottom-loading{
  	display: none !important;
  }
</style>