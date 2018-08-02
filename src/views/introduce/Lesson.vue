<template>
	<!--课节页面-->
	<div class="Lesson">
		<!--头部图片标题区-->
		<div class="Lesson-header">
			<img class="header-photo" src="../../assets/icon/couponhead.png"/>
			<div class="header-title">
				01、围绕用户价值，最大化你的运营产出
			</div>
		</div>
		<!--富文本区-->
		<div class="Lesson-module">
      <div class="module-header">
      	<div class="head-photobox">
      		<img src="../../assets/icon/login-logo.png"/>
      		<span class="name">路叔</span>
      	</div>
      	<div class="date">{{1533139200000 | date('YYYY-MM-DD')}}</div>
      </div>
      <div class="module-content h5-code">
      </div>
    </div>
    <!--本节任务-->
		<div class="Lesson-task">
			<div class="task-photo"></div>
			<div class="content-txt">
				本节中提到的运营心法，那针对以下几个点说 说你们的想法： 
				1、如果遇到同样的用户运营问题，你会怎么处 理？ 
				2、你目前或以前遇到过什么类似的坎过不去 吗？显示上完课之后是否有新的方案去解决？
			</div>
			<div class="content-img">
				
			</div>
		</div>
		<!--打卡区-->
		<div class="Lesson-punch">
			<div class="punch-photo"></div>
			<!--优秀打卡-->
			<div class="Excellent-punch">
				<div class="Excellent-punch-title"></div>
			</div>
			<!--所有打卡-->
		</div>
		
		<!--底部打卡按钮区-->
		<div class="Lesson-footer" v-if="isPunch === 0">
			<div class="toPunch" @click.stop="toPunch">
				去打卡
			</div>
		</div>
		<div class="Lesson-footer" v-else>
				<div class="peacock">炫耀一下</div><span class="line"></span>
				<div class="mine">我的打卡</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamic from '@/components/dynamic/dynamic'
  @Component({
    name: 'Lesson',
    components: {
      dynamic
    },
    computed: {
    	
    },
    watch: {
      
    },
  })
  export default class Lesson extends Vue {
  	isPunch = 0	//是否已经打卡
  	
  	toPunch(){
  		alert("我是要跳转去打卡页面的")
//		this.$router.push({path:'去打卡的页面'})
  	}
  }
</script>

<style lang="less" scoped>
	.Lesson{
		/*课节头部*/
		.Lesson-header{
			
			.header-photo{
				width: 100%;
				height: 175px;
			}
			.header-title{
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				margin-top: 25px;
				font-size: 21px;
				font-weight: 700;
				color: #354048;
				
			}
		}
		/*课节富文本*/
		.Lesson-module{
			margin-top: 15px;
			.module-header{
				padding: 0 20px;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				.head-photobox{
					display: flex;
					align-items: center;
					img{
						width: 24px;
						height: 24px;
					}
					.name{
						margin-left: 8px;
						font-size: 14px;
						color: #666666;
					}
				}
				
			}
		}
		/*本节打卡任务*/
		.Lesson-task{
			
			.task-photo{
				width: 100%;
				height: 54px;
				background-color: #C9C9C9;
				margin-bottom: 30px;
			}
			.content-txt{
				width: 100%;
			}
			.content-img{
				img{
					
				}
			}
		}
		/*打卡区*/
		.Lesson-punch{
			.punch-photo{
				width: 100%;
				height: 54px;
				background-color: #666666;
			}
			/*优秀打卡*/
			.Excellent-punch{
				.Excellent-punch-title{
					
				}
			}
		}
		/*课节底部按钮区*/
		.Lesson-footer{
			width: 100%;
			height: 49px;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 9999;
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			border-top: 0.5px solid #DCDCDC;
			
			.toPunch{
				width: 100%;
				height: 100%;
				background-color: #FFE266;
				line-height: 49px;
				text-align: center;
				color: #354048;
			}
			.peacock,.mine{
				height: 100%;
				width: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #354048;
			}
			.line{
				width: 2px;
				height: 28px;
				background-color: #EDEDED;
				
			}
		}
		/*公共部分*/
		.Lesson-punch,.Lesson-task{
			margin-top: 60px;
			padding: 0 20px;
			box-sizing: border-box;
		}
		
	}
</style>