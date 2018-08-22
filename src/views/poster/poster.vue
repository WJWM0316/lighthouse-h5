<template>
	<div class="wrap">
		<canvas id="poster" ref="poster" width="750" height="1300"></canvas>
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/01.png" v-if="random === '01'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/02.png" v-if="random === '02'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/03.png" v-if="random === '03'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/04.png" v-if="random === '04'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/05.png" v-if="random === '05'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/06.png" v-if="random === '06'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/07.png" v-if="random === '07'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/08.png" v-if="random === '08'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/09.png" v-if="random === '09'" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/10.png" v-if="random === 10" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/11.png" v-if="random === 11" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/12.png" v-if="random === 12" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/13.png" v-if="random === 13" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/14.png" v-if="random === 14" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/15.png" v-if="random === 15" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/16.png" v-if="random === 16" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/17.png" v-if="random === 17" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/18.png" v-if="random === 18" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/20.png" v-if="random === 19" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/20.png" v-if="random === 20" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/21.png" v-if="random === 21" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/22.png" v-if="random === 22" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/23.png" v-if="random === 23" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/24.png" v-if="random === 24" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/25.png" v-if="random === 25" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/26.png" v-if="random === 26" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/27.png" v-if="random === 27" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/28.png" v-if="random === 28" crossOrigin="Anonymous">
		<img id="scream"  @load="nextBg" ref="scream" src="../../assets/poster/28.png" v-if="random === 29" crossOrigin="Anonymous">
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
	    // 29张背景图 随机抽一张
	    this.random = Math.floor(Math.random()*29)+1
	    if (this.random < 10) this.random = `0${this.random}`
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
		background: #F2F2F2;
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