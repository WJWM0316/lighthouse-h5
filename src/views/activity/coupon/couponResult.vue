<template>
	<div class="resultPage">
		<img src="../../../assets/icon/activebg.png"/>
		<!--标题-->
		<div class="title">
			<span>关注小灯塔公众号</span>
			<span>有更多精彩内容和福利</span>
		</div>
		<!--二维码-->
		<div class="QRcode">
			<img class="QR" src="../../../assets/icon/wx-qrcode.png" alt="" />
			<div class="txt">
				<span>非微信打开，怎么办？</span>
				<span>请先保存图片，再用微信扫一扫或者</span>
				<span>打开微信搜索公众号“小灯塔”进行关注</span>
			</div>
		</div>
		<!--按钮-->
		<div class="btn">
			保存图片
		</div>
	</div>
</template>

<script>
	
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
			width: 230px;
			height: 55px;
			position: absolute;
			top: 40px;
			left: 73px;
			font-size:23px;
			color:rgba(255,255,255,1);
			span{
				display: block;
				width: 100%;
				text-align: center;
				height: 27px;
			}
		}
		/*二维码*/
		.QRcode{
			position: absolute;
			top: 135px;
			left: 42.5px;
			width: 290px;
			height: 352px;
			background-color: #FFFFFF;
			.QR{
				display: block;
				width:190px;
				height:190px;
				padding: 22.5px 50px 27px;
				border-bottom: 1px solid rgba(151,151,151,1);
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