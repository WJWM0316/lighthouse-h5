<template>
	<div class="resultPage">
		<img src="../../../assets/icon/activebg.png"/>
		<!--标题-->
		<div class="title" v-show="status===3">
			<span>关注小灯塔公众号</span>
			<span>有更多精彩内容和福利</span>
		</div>
		<div class="title" v-show="status===2">
			<span>你已经领过该优惠券</span>
			<span>请到小灯塔体验</span>
		</div>
		<div class="title" v-show="status===1">
			<span>领取成功</span>
			<span>请到小灯塔体验</span>
		</div>
		<!--二维码-->
		<div class="QRcode">
			<div class="tip">长按识别二维码</div>
			<img class="QR" v-if="isNeed === 'isNeed'" src="../../../assets/icon/wx-qrcode3.png" alt="" />
			<img class="QR" v-if="isNeed === 'isBoss'" src="../../../assets/icon/wx-qrcode4.png" alt="" />
			<img class="QR" v-else src="../../../assets/icon/wx-qrcode2.png" alt="" />
			<div class="txt">
				<span>非微信打开，怎么办？</span>
				<span>请先保存图片，再用微信扫一扫或者</span>
				<span>打开微信搜索公众号“小灯塔职场”进行使用</span>
			</div>
		</div>
		<!--按钮-->
		<!--<div class="btn">
			保存图片
		</div>-->
	</div>
</template>

<script>
	import Vue from 'vue'
	export default {
		data(){
			return{
				status:'',
				isNeed: ''
			}
		},
		created(){
			let pattern = /(\w+)=(\w+)/ig;
			let isNeed = /([^&]+)$/ig;
			let str = window.location.hash;
			let status = str.match(pattern);
			this.isNeed = str.match(isNeed)[0];
//			this.status=1;
			switch(status[0]){
				case "status=receive":
							this.status=1;
							break;
				case "status=issued":
							this.status=2;
							break;
				case "status=end":
							this.status=3;
							break;	
			}
			console.log(this.status,"111111111111111111")
		}
	}
</script>

<style lang="less" scoped>
	.resultPage{
		position: relative;
		width: 100%;
		height: 100%;
		background:linear-gradient(180deg,rgba(64,71,80,1),rgba(100,110,122,1));
		img{
			width: 100%;
		}
		/*标题*/
		.title{
			width: 100%;
			height: 55px;
			position: absolute;
			top: 50px;
			left: 0;
			font-size:23px;
			color:rgba(255,255,255,1);
			span{
				display: block;
				width: 100%;
				text-align: center;
				height: 27px;
				white-space: nowrap;
			}
		}
		/*二维码*/
		.QRcode{
			position: absolute;
			top: 145px;
			left: 42.5px;
			width: 290px;
			height: 388px;
			background-color: #FFFFFF;
			.tip{
				position: absolute;
				top: 228px;
				left: 50%;
				transform: translateX(-50%);
				font-size:15px;
				color:rgba(53,64,72,1);
				line-height:16px;
				&::before{
					content: '';
					display: block;
					width: 20px;
					height: 0px;
					position: absolute;
					top: 8px;
					left: -32px;
					border-top:0.5px solid #929292;
				}
				&::after{
					content: '';
					display: block;
					width: 20px;
					height: 0px;
					position: absolute;
					top: 8px;
					right: -32px;
					border-top:0.5px solid #929292;
				}
			}
			.QR{
				display: block;
				width:190px;
				height:190px;
				padding: 22.5px 50px 56px;
				border-bottom: 0.5px solid #DCDCDC;
			}
			.txt{
				padding: 25px 0 30px;
				margin: 0 auto;
				>span{
					display: block;
					text-align: center;
					color: rgba(146,146,146,1);
					font-size:13px;
					height:13px;
					line-height: 13px;
					padding-top: 5px;
					white-space: nowrap;
				}
			}
		}
		/*底部按钮*/
		.btn{
			width: 325px;
			height: 44px;
			background-color: rgba(255,226,102,1);
			border-radius:100px;
			position: absolute;
			bottom: 36px;
			left: 25px;
			line-height: 44px;
			text-align: center;
			font-size:16px;
			color:rgba(53,64,72,1);
		}
	}
</style>