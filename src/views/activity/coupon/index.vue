<template>
	<div class="receive-coupons" v-if="item.id!==''">
		<div class="headPhoto">
			<img :src="item.imgUrl" alt="" />
		</div>
		<div class="content" :class="{'isReceive':item.status===2}">
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
						有效期：{{startTime}}-{{endTime}}
					</span>
				</div>
			</div>
			<div class="line"></div>
			<div class="bottom">
				<div class="receive" v-if="item.status===1" @click.stop="receive">免费领取优惠券</div>
				<div class="unReceive" v-else>
					<span class="littleTitle" v-show="isReceive">你已经领取过该优惠券啦，快去使用吧！</span>
					<span class="littleTitle" v-show="!isReceive">来晚啦～优惠券已经被领完了！</span>
					<div v-show="isReceive" @click.stop="toUse">
						已经领取
					</div>
					<div v-show="!isReceive" @click.stop="toLate">
						查看更多职场福利
					</div>
				</div>
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
	import { couponReceiveApi,couponsApi } from '@/api/pages/pageInfo'
	export default {
		data(){
			return {
					item:{
						id:'',		//优惠券的id
						title:'',
						discount:'',		//优惠券的金额
						imgUrl:"",
						relationCommunity:{
							title:'',
						},
						status:'',		//是否为可领取状态：1.正常;2.不可领取;3.不可使用
					},
//				item:{
//					id:'11',		//优惠券的id
//					title:'手把手教你学产品 从入门到放弃放弃放弃放… ',
//					discount:'9',		//优惠券的金额
//					imgUrl:"https://cdnstatic.ziwork.com/Uploads/static/picture/2018-06-26/dd3aca0483c85eea2be91589c1f0e71c.jpeg",
//					relationCommunity:{
//						title:'手把手教你学产品 从入门到放弃放弃放弃放…',
//					},
//					status:2,		//是否为可领取状态：1.正常;2.不可领取;3.不可使用
//				},
				isReceive:'',		//是否领取
				status:'',			//路劲带过来的id
				starTime:{},		//优惠券开始时间
				EndTime:{},			//优惠券结束时间
			}
		},
		methods:{
			//免费领取
			receive(){
//				alert("我是正常领取调用")
				couponReceiveApi(this.item.id).then((res)=>{
					window.location.href="https://demo2016.thetiger.com.cn/beaconweb/?#/couponResult?status=1";
				}).catch((res)=>{
					console.log("领取出错信息：",res)
				})
			},
			//已经领取，去使用
			toUse(){
//				alert("已领取调用")
				window.location.href="https://demo2016.thetiger.com.cn/beaconweb/?#/couponResult?status=2";
			},
			//领取完了
			toLate(){
				alert("无法领取调用")
				window.location.href="https://demo2016.thetiger.com.cn/beaconweb/?#/couponResult?status=3";
			}
		},
		created(){
			//获取优惠券id
			let pattern = /(\d+)/ig;
			let str = window.location.hash;
			let status = str.match(pattern);
			console.log(status,"...............")
			this.status = parseInt(status[0]);
			
			
			document.querySelector('title').innerHTML = "领取优惠券"
			couponsApi(this.status).then((res)=>{
				
				//已授权请求成功
				this.item=res.coupon;
				this.isReceive = res.isReceive;
				let star =  new Date(res.coupon.useStartTime);
				let end =  new Date(res.coupon.useEndTime);//
				console.log(`${end.getFullYear()}.${end.getMonth()+1}.${end.getDate()}`,res,"我是返回数据")
				this.starTime = `${star.getFullYear()}.${star.getMonth()+1}.${star.getDate()}`;
				this.EndTime = `${end.getFullYear()}.${end.getMonth()+1}.${end.getDate()}`;
				console.log(res,that.item,"我是res  和     item   。。。")
				
			}).catch((res)=>{
				
				//未授权
				console.log(res)
				if(res.statusCode===413){
					this.$vux.confirm.show({
						title:'微信授权',
						content:'小灯塔Lite申请获得以下权限： 获得你的公开信息(昵称、头像等)',
					  onCancel () {
					  	window.opener = null;
							window.close();
					  },
					  onConfirm () {
					  	let a = new Date(1532745050)
					  	console.log(a.getFullYear(),"................")
					  	let backUrl={redirect_url:"'https://www.ziwork.com/beaconweb/#/examination'"}
					  	let {url}=res.data;
//							console.log(url+"?redirect_url="+parseInt(status[0]));
							window.location.href=url+"?redirect_url="+parseInt(status[0]);
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
			/*height: 428px;*/
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
							text-align: center;
							min-width: 75px;
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
				.receive,
				.unReceive>div{
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
				.unReceive{
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					margin: 20px 18px 28px;
					padding: 20px 12.5px;
					background-color: #FFFDF3;
					>.littleTitle{
						text-align: center;
						line-height:20px;
						padding-bottom: 12px;
						font-size: 14px;
						color:rgba(53,64,72,1);
						display: block;
						min-width: 252px;
					}
				}
				.unReceive>div{
					min-width: 285px;
					margin: 0;
					background-color:#FFE266;
					color: #354048;
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
					padding-bottom: 27px;
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
			/*height: 429px !important;*/
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