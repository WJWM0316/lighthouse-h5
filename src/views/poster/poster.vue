<template>
	<div class="wrap">
		<canvas id="poster" ref="poster" width="750" height="1300"></canvas>
		<img id="scream"  @load="nextBg" ref="scream" src='https://cdnstatic.ziwork.com/Public/show/01.png' crossOrigin="Anonymous">
<!-- 		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/02.png' crossOrigin="Anonymous" v-if="random == '02'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/03.png' crossOrigin="Anonymous" v-if="random == '03'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/04.png' crossOrigin="Anonymous" v-if="random == '04'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/05.png' crossOrigin="Anonymous" v-if="random == '05'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/06.png' crossOrigin="Anonymous" v-if="random == '06'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/07.png' crossOrigin="Anonymous" v-if="random == '07'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/08.png' crossOrigin="Anonymous" v-if="random == '08'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/09.png' crossOrigin="Anonymous" v-if="random == '09'">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/10.png' crossOrigin="Anonymous" v-if="random == 10">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/11.png' crossOrigin="Anonymous" v-if="random == 11">
		<img id="scream"  @load="nextBg" ref="scream" src='../../assets/poster/12.png' crossOrigin="Anonymous" v-if="random == 12"> -->
		<img id="ewema" ref="ewema" src="../../assets/icon/erweima.png">
		<div class="imgBox">
			<img class="showImg" :src="path">
		</div>
		<div class="msg"><i class="line"></i>长按图片保存<i class="line"></i></div>
	</div>
</template>
<script>
	import Vue from 'vue'
  import Component from 'vue-class-component'
  @Component({
  })
  export default class notFound extends Vue {
  	ctx = ''
  	path = '' // 最终导出的图片链接
  	bgSrc = ''
  	random = 0
  	nextBg () {
  		let ctx = this.ctx
			ctx.fillStyle="#000000"
			ctx.fillRect(0,0,750,1300)
			let img = this.$refs.scream
			ctx.drawImage(img,0,0,750,1300)
			let name = this.$route.query.name
			// 计算文本字节
	    function pointOut (string, num) {
	    	let result = string.length
	    	let length = 0
		    for (var i=0; i<string.length-1; i++) {
		    	// 检查双字节
		    	if (string[i].match(/[^\x00-\xff]/)) {
		    		length += 2
		    	} else {
		    		length += 1
		    	}
		    	if (length > num) { // 判断是否超过 是否需要打点
			    	result =  i
			    	return result
			    }
		    }
		    return result
	    }
	    let lineNum1 = pointOut(name, 14)
			if (lineNum1 !== name.length) {
	    	name = name.slice(0, lineNum1) + '...'
	    }

			let txt1 = '我是'
			let txt2 = '，刚解锁完这节课啦：'
			ctx.font = '300 26px Arial'
			ctx.fillStyle = '#ffffff'
			let y = 1170, x = 50
			ctx.fillText(txt1,x,y)
			x = x + ctx.measureText(txt1).width + 5
			ctx.save()
			ctx.font = "500 26px Arial";
			ctx.fillText(name,x,y)
			ctx.restore()
			x = x + ctx.measureText(name).width + 5
			ctx.fillText(txt2,x,y)
			y = y + 20
			ctx.strokeStyle="#FFFFFF";
			ctx.strokeRect(50,y,6,60)

			let title = this.$route.query.title
			y = y + 20
			ctx.font = '300 24px Arial'
			let lineNum2 = pointOut(title, 40)
	    if (lineNum2 < title.length) {
	    	ctx.fillText(title.slice(0, lineNum2), 74, y)
	    	y = y + 34
	    	ctx.fillText(title.slice(lineNum2 + 1, title.length), 74, y)
	    } else {
	    	ctx.fillText(title.slice(0, lineNum2), 74, y)
	    }
	    ctx.drawImage(this.$refs.ewema,584,1144,116,116)
	    // this.path = this.canvas.toDataURL("image/png")
	    try {
				this.path = this.canvas.toDataURL("data:image/png;")
			}
			catch(err) {
				alert(err)
			}
	    
	    if (this.path) {
	    	Vue.$vux.loading.hide()
	    }
  	}

  	mounted () {
  		let that = this
  		Vue.$vux.loading.show({
	      text: '图片正在生成中'
	    })
	    // 28张背景图 随机抽一张
	    this.random = Math.floor(Math.random()*6)+1
	    if (this.random < 10) this.random = `0${this.random}`
	    console.log(this.random, 11)
  		this.canvas = document.getElementById('poster')
			this.ctx = this.canvas.getContext("2d")
		}
  }
</script>
<style lang="less" type="text/less" scoped>
	.wrap {
		width: 100%;
		height: 100%;
		padding-bottom: 44px;
		#poster {
			width: 0;
			height: 0;
		}
		#scream, #ewema {
			width: 0;
			height: 0;
		}
		.showImg {
			width: 310px;
			margin: 0 auto;
			display: block;
		}
		.msg {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			line-height: 44px;
			height: 44px;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			background:rgba(255,255,255,0.8);
			color: #354048;
			font-size: 16px;
			.line {
				width:28px;
				height:1px;
				background: #979797;
				margin: 0 13px;
				display: inline-block;
			}
		}
	}
</style>