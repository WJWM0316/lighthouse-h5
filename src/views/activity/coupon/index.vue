<template>
	<div class="receive-coupons" v-if="item.id!==''">
		<div class="headPhoto">
			<img :src="item.imgUrl" alt="" />
		</div>
		<div class="content {isReceive:true}">
			<div class="top">
				<div class="left">
					<span>￥</span><span>{{item.discount}}</span>
					<p>优惠金额</p>
				</div>
				<div class="right">
					<span>
						仅可购买《{{item.relationCommunity.title}}》
					</span>
					<span>
						有效期：2017.12.1-2018.1
					</span>
				</div>
			</div>
			<div class="line"></div>
			<div class="bottom">
				<div class="receive" @click="receive">免费领取优惠券</div>
				<div class="rule">
					<span></span>
					活动规则
					<span></span>
				</div>
				<div class="rule-content">
					<span>1.红包新老用户同享；</span>
					<span>2.红包仅限在线支付使用，且不可与其他优惠叠加使用；</span>
					<span>3.其他未尽事宜，请咨询客服，客服微信号zike02。</span>
				</div>
			</div>
		</div>
		<!--底部-->
		<div class="footer">
			- 小灯塔·职场学习平台 -
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { couponAuthorizationApi,couponsApi } from '@/api/pages/pageInfo'
	export default {
		data(){
			return {
				item:{
					id:'',
					title:'',
					discount:'',
					imgUrl:'',
					relationCommunity:{
						title:'',
					}
				}
			}
		},
		methods:{
			receive(){
				
			}
		},
		created(){
			document.querySelector('title').innerHTML = "领取优惠券"
			let that = this;
			couponsApi(11).then((res)=>{
				//已授权请求成功
				that.item=res.coupon;
				console.log(res,that.item,"我是res  和     item   。。。")
			}).catch((res)=>{
				//未授权
				console.log(res)
				if(res.statusCode===413){
					that.$vux.confirm.show({
						title:'微信授权',
						content:'小灯塔Lite申请获得以下权限： 获得你的公开信息(昵称、头像等)',
					  onCancel () {
					  	window.opener = null;
							window.close();
					  },
					  onConfirm () {
					  	let backUrl={redirect_url:"'https://www.ziwork.com/beaconweb/#/examination'"}
					  	let {url}=res.data;
							console.log(url);
							window.location.href=url+"?coupon_id=11";
					  }
					})
				}
			})
		},
		mounted(){
			
		}
	}
</script>

<style lang="less" scoped>
	.receive-coupons{
		background-color: #FFE266;
		.headPhoto{
			height: 280px;
			width: 100%;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.content{
			position: relative;
			margin-top: -60px;
			margin-left: auto;
			margin-right: auto;
			z-index: 999;
			width: 345px;
			height: 428px;
			background-color: #FFFFFF;
			border-radius: 10px;
			
			.top{
				width: 100%;
				height: 116px;
				box-sizing: border-box;
				/*background-color: #FFFFFF;*/
				padding: 28px 0;
				display: flex;
				.left{
					display: flex;
					flex-shrink: 0;
					flex-wrap: wrap;
					align-items: flex-end;
					justify-content: center;
					width: 130px;
					/*max-width: 140px;*/
					border-right: 1px solid #EEEEEE;
					span{
						&:nth-child(1){
							font-size: 12px;
							color: #FA6A30;
							line-height: 20px;
						}
						&:nth-child(2){
							font-size: 36px;
							font-weight: 600;
							color: #FA6A30;
							line-height: 36px;
						}
					}
					p{
						font-size: 12px;
						/*line-height: 12px;*/
						color: #666666;
						text-align: center;
					}
				}
				.right{
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
					span{
						width: 180px;
						&:nth-child(1){
							font-size:15px;
							line-height: 20px;
							color:#354048;
							
							overflow: hidden;
	            text-overflow: ellipsis;
	            display: -webkit-box;
	            -webkit-line-clamp:2;
	            -webkit-box-orient: vertical;
						}
						&:nth-child(2){
							font-size: 13px;
							color: #929292;
							margin-top: 5px;
							line-height: 12px;
						}
					}
				}
			}
			/*分界线*/
			.line{
				position: relative;
				border-bottom: 3px dotted #FFE266;
				&::before{
					content: '';
					width: 13px;
					height: 13px;
					border-radius: 50%;
					background-color: #FFE266;
					position: absolute;
					left: 0;
					transform: translateX(-50%) translateY(-50%);
				}
				&::after{
					content: '';
					width: 13px;
					height: 13px;
					border-radius: 50%;
					background-color: #FFE266;
					position: absolute;
					right: 0;
					transform: translateX(50%) translateY(-50%);
				}
			}
			/*优惠券下半部分*/
			.bottom{
				/*领取按钮*/
				.receive{
					width: 285px;
					height: 49px;
					border-radius: 22px;
					background-color: #FA6A30;
					color: #FFFFFF;
					margin: 25px auto 45px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				/*底部规则*/
				.rule{
					display: flex;
					justify-content: center;
					align-items: center;
					color: #666666;
					font-size: 15px;
					margin-bottom: 15px;
					span{
						width:89px;
						margin: 0 19px;
						border-bottom: 1px solid #EDEDED;
						position:relative; 
						&:nth-child(1)::after{
							position: absolute;
							right: -4px;
							content: '';
							display: block;
							width:6px;
							height: 6px;
							background-color: #EDEDED;
							transform: rotate(45deg) translateY(-50%);
						}
						&:nth-child(2)::before{
							position: absolute;
							left: -9px;
							content: '';
							display: block;
							width:6px;
							height: 6px;
							background-color: #EDEDED;
							transform: rotate(45deg) translateY(-50%);
						}
					}
				}
				/*规则内容*/
				.rule-content{
					span{
						display: block;
						width: 291px;
						margin: 0 auto;
						margin-bottom: 10px;
						color: #929292;
						font-size: 13px;
						line-height: 15px;
					}
				}
			}
		}
		.isReceive{
			height: 429px !important;
		}
		
		/*底部文案*/
		.footer{
			display: flex;
			align-items: center;
			justify-content: center;
			color: #A37A43;
			font-size: 12px;
			width: 100%;
			height: 48px;
		}
	}
</style>