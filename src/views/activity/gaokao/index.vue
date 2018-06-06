<template>
	<div class="gaokao">
		<!-- <div class="title">高考加油生成器</div> -->
		<div class="bg">
			<div class="box">
				<img src="./../../../assets/icon/bg.jpg" alt="">
			</div>
		</div>
		<div class="form">
				<group>
				<popup-picker title="你的高考年份" :data='years' placeholder="请选择" v-model='year'></popup-picker >
				<div class="cityBar"> 
					<x-address title="为哪个城市考生加油" v-model="city" placeholder="请选择" :list="addressData" raw-value hide-district>
					</x-address>
					<span class="cityName" v-show="city.length > 0">广州市</span>
				</div>
				</group>
				<div class="btn" @click.stop="sublime">一键生成 · 高考加油海报</div>
		</div>
		<div class="erwei" v-show="show">
			<div class="inner">
				<p>成功生成海报！<br>长按识别前往查看</p>
				<div class="close" @click.stop="close"><img src="./../../../assets/icon/close.png" alt=""></div>
				<img src="./../../../assets/page/jingxun.png" alt="">
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import { Group, PopupPicker, XAddress, ChinaAddressV4Data } from 'vux'
	import { gaokaoApi } from '@/api/pages/pageInfo'
	let years = []
	for (var i = 2018; i >= 1977; i--) {
	  years.push({
	    name: i + '年',
	    value: i + '年'
	  })
	}
	export default {
		data () {
			return {
				city: [],
				year: [],
				cityName: '',
				years: [years],
				addressData: ChinaAddressV4Data,
				show: false
			}
		},
		components: {
			Group,
	    PopupPicker,
	    XAddress
	  },
	  watch: {
	  	city (val) {
	  		console.log(val)
	  		let cityHtml = ''
	  		let city = ''
	  		const _this = this
	  		setTimeout(function () {
		  		if (document.querySelector('.cityBar .vux-popup-picker-value')) cityHtml = document.querySelector('.cityBar .vux-popup-picker-value').innerHTML
		  		console.log(cityHtml)
		  		city = cityHtml.split(' ')[0] === '北京市' || cityHtml.split(' ')[0] === '天津市' || cityHtml.split(' ')[0] === '上海市' || cityHtml.split(' ')[0] === '重庆市' ? cityHtml.split(' ')[0] : cityHtml.split(' ')[1]
		  		_this.cityName = city
		  		document.querySelector('.cityName').innerHTML = city
	  		}, 50)
	  	}
	  },
	  methods: {
	  	sublime () {
	  		if (this.year.length === 0) {
	  			this.$vux.toast.text('请选择高考年份', 'bottom')
	  			return
	  		}
	  		if (this.city.length === 0) {
	  			this.$vux.toast.text('请选择城市', 'bottom')
	  			return
	  		}
	  		var reg = new RegExp("市")
	  		this.cityName = this.cityName.replace(reg, "")
	  		const data = {
	  			year: this.year[0],
	  			city: this.cityName
	  		}
	  		gaokaoApi(data).then(res => {
	  			this.show = true
	  		}).catch(err => {
	  			this.$vux.toast.text(e, 'bottom')
	  			return Promise.reject(err)
	  		})
	  	},
	  	close () {
	  		this.show = false
	  	}
	  },
	  created () {
	  	if (document.querySelector('title').innerHTML = '小灯塔') {
	  		document.querySelector('title').innerHTML = '为考生加油'
	  	}
	  }
	}
</script>
<style lang="less" type="text/less">
	.gaokao {
		height: 100%;
		box-sizing: border-box;
		background:rgba(248,248,248,1);
		padding-bottom: 165px;
		.title {
			text-align: center;
		}
		.bg {
			width: 100%;
			height: 100%;
			padding: 10px 15px;
			box-sizing: border-box;
    	.box {
				overflow: hidden;
				display: flex;
				justify-content: center;
	    	align-items: center;
				width: 100%;
				height: 100%;
    	}
			img {
				display: block;
				width: 100%;
			}
		}
		.form {
			width: 100%;
			padding-bottom: 18px;
			position: fixed;
			left: 0;
			bottom: 0;
			background: #fff;
			.weui-cells {
				margin-top: 0 !important;
				background: none;
				&:before, &:after {
					display: none;
				}
			}
			.weui-label {
				color: #354048;
				font-size: 15px;
				position: relative;
				padding-left: 10px;
				&::before {
					content: '*';
					color: #D7AB70;
					font-size: 15px;
					position: absolute;
					left: 0;
				}
			}
			.vux-cell-placeholder {
				font-size: 15px;
				color: #BCBCBC;
			}
			.vux-popup-picker-value {
				font-size: 15px;
				color: #000;
			}
			.cityBar {
				position: relative;
				.vux-popup-picker-value {
					opacity: 0;
					display: none;
					font-size: 15px;
				}
				.cityName {
					color: #000;
					height: 41px;
					line-height: 41px;
					font-size: 15px;
					position: absolute;
					top: 0;
					right: 30px;
					z-index: -1;
				}
			}
			.btn {
				width: 320px;
				height: 44px;
				margin: 18px auto 0;
				background:rgba(255,226,102,1);
				box-shadow:0px 3px 6px 0px rgba(200,179,92,0.34);
				border-radius:44px;
				font-size:16px;
				line-height: 44px;
				color: #354048;
				text-align: center;
			}
		}
		.erwei {
			width: 100%;
			height: 100%;
			background:rgba(0,0,0,0.5);
			display: flex;
			justify-content: center;
    	align-items: center;
    	position: fixed;
    	top: 0;
    	left: 0;
    	.inner {
				width: 285px;
				height: 296px;
				padding: 40px 0 0 0;
				background:rgba(255,255,255,1);
				border-radius:12px;
				text-align: center;
				position: relative;
				box-sizing: border-box;
				p {
					margin-bottom: 10px;
					font-size:16px;
					font-family:PingFangSC-Regular;
					color:rgba(53,64,72,1);
					line-height: 20px;
				}
				img {
					width: 160px;
				}
				.close {
					position: absolute;
					width: 15px;
					height: 15px;
					top: 11px;
					right: 11px;
					padding: 10px;
					img {
						width: 15px;
						height: 15px;
						display: block;
					}
				}
    	}
		}
	}
</style>