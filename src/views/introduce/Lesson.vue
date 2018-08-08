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
      <!--视频-->
      <div class="Lesson-video" @click.stop="playVideo">
      	<video controls ref="video"></video>
      	<div class="placeholder" v-show="videoPlay">
          <!--背景图-->
          <!--<img />-->
        </div>
      </div>
      <!-- 音频 -->
      <div :class="{'content-audio': true, 'not-played': !item.files[0].isPlayed}">
        <audioBox
          :source="item.files[0]" 
          :touerImg="item.files[0].avatar"
          :isDetailCon='false'
          ></audioBox>
      </div>
      <div class="module-content h5-code">
      	我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本我是富文本
      </div>
    </div>
    <!--本节任务-->
		<div class="Lesson-task">
			<!--头部标题-->
			<div class="headerBox">
				<div class="title-pic1">
					<span class="txt">本节打卡任务</span>
				</div>
				<div class="title-pic2"></div>
			</div>
			<!--头部标题-->
			<div class="content-txt">
				本节中提到的运营心法，那针对以下几个点说 说你们的想法： 
				1、如果遇到同样的用户运营问题，你会怎么处 理？ 
				2、你目前或以前遇到过什么类似的坎过不去 吗？显示上完课之后是否有新的方案去解决？
			</div>
			<div class="content-img">
				
			</div>
		</div>
		<!--优秀打卡区-->
		<div class="Lesson-punch" v-if="dynamicList!=={}">
			<!--头部标题-->
			<div class="headerBox">
				<div class="title-pic1">
					<span class="txt">打卡区</span>
				</div>
				<div class="title-pic2"></div>
			</div>
			<!--优秀头部标题图片-->
			<div class="Excellent-punch">
				<div class="Excellent-punch-title">优秀打卡</div>
			</div>
			<div class="hr"></div>
			<!--优秀打卡内容区-->
			<lessondynamicItem :item="dynamicList"
         :showDelBtn="false"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="true"
         :disableContentClick="false"
      ></lessondynamicItem>
      <div class="Expand-btn" @click.stop="toPunchList">查看所有优秀打卡 <span>(12)</span></div>
		</div>
		<!--所有打卡区-->
		<div class="all-punch">
			<div class="Excellent-punch">
				<div class="Excellent-punch-title">所有打卡</div>
			</div>
			<div class="hr"></div>
			<lessondynamicItem :item="dynamicList"
         :showDelBtn="false"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="true"
         :disableContentClick="false"
      ></lessondynamicItem>
      <div class="Expand-btn all-show">查看所有打卡 <span>(32)</span></div>
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
	import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
  import audioBox from '@/components/media/music'
  @Component({
    name: 'Lesson',
    components: {
      lessondynamicItem,
      audioBox
    },
    computed: {
    	
    },
    watch: {
      
    },
  })
  export default class Lesson extends Vue {
  	video = '' //视频
  	videoPlay = true //视频是否在播放
  	showIdentification = true
    disableOperationArr = ['comment']
    isPlayList = false
    item = {
    	files:[{
				duration:6,
				fileId:"5329",
				fileName:"2JVOTrwtULW3VpcKI3whmcDNYTlTMEVQzPpxN3ZDfXOcFYKtUiv7XZwjXolTara2.amr",
				fileUrl:"https://cdnstatic.ziwork.com/test/audio/2018-06-14/6b4856190e86d63da132708f75c8089f.mp3",
				avatar:"http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicZ5SI1SDic7poUzQISNRsBIgxnyT8Qv2S8dYEicIuCPyibLykxqkE5nfyC5K765DIiayFo3Aj6PG1bSmw/132",
				isPlayed:true,
				size:56492
	    }]
    }
    //打卡虚拟数据
    dynamicList = {
				circleId:"1297",
				circleType:3,
				commentTotal:4,
				comments:[{
					commentId:5233,
					content:"独孤皇后",
					isSelf:0,
					releaseTime:1531995562,
					reviewer:{
						avatar:"http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicZ5SI1SDic7poUzQISNRsBIgxnyT8Qv2S8dYEicIuCPyibLykxqkE5nfyC5K765DIiayFo3Aj6PG1bSmw/132",
						career:"职位待完善",
						gender:1,
						office:"前端有限责任公司",
						realName:"Lunch06",
						userId:"51c4778f0173405fd08e5361d793cb12",
						workTimeName:""
					}
				}],
//				content:"dfasdfjlaskdfjlsakdjflasdjlk",
				content:"看这里，展示规则：超过6行文字打点，第七行 显示全文按钮「展开全文」，展开后可收起， 文字按钮为「收起全文」。注意间距。点进详 情页后，文字不做收起，全文展开。没有文字 按钮。这行是来撑字数的撑字数撑，最后要打 点（忽略这里的内容，撑字数用的我是嗯）…我还没超出吗爱爱 啊啊啊啊啊啊啊爱爱 ",
				favorTotal:2,
				favors:[{userId: "85994e9fb90e1fbe8b112230e9db3111", realName: "火姐"}],
				files:[
					{
						duration:0,
						fileId:"6035",
						fileName:"tmp_34c42c14e479387ebbd95a632e0f974c.jpg",
						fileUrl:"https://cdnstatic.ziwork.com/test/image/2018-08-03/e7c38af8b46a9b55f768b4928edb7453.jpg",
						imgHeight:0,
						imgWidth:0,
						isPlayed:false,
						size:218443
					},
					{
						duration:0,
						fileId:"6035",
						fileName:"tmp_34c42c14e479387ebbd95a632e0f974c.jpg",
						fileUrl:"https://cdnstatic.ziwork.com/test/image/2018-08-03/e7c38af8b46a9b55f768b4928edb7453.jpg",
						imgHeight:0,
						imgWidth:0,
						isPlayed:false,
						size:218443
					},
					{
						duration:0,
						fileId:"6035",
						fileName:"tmp_34c42c14e479387ebbd95a632e0f974c.jpg",
						fileUrl:"https://cdnstatic.ziwork.com/test/image/2018-08-03/e7c38af8b46a9b55f768b4928edb7453.jpg",
						imgHeight:0,
						imgWidth:0,
						isPlayed:false,
						size:218443
					},
					{
						duration:0,
						fileId:"6035",
						fileName:"tmp_34c42c14e479387ebbd95a632e0f974c.jpg",
						fileUrl:"https://cdnstatic.ziwork.com/test/image/2018-08-03/e7c38af8b46a9b55f768b4928edb7453.jpg",
						imgHeight:0,
						imgWidth:0,
						isPlayed:false,
						size:218443
					},
					{
						duration:0,
						fileId:"6035",
						fileName:"tmp_34c42c14e479387ebbd95a632e0f974c.jpg",
						fileUrl:"https://cdnstatic.ziwork.com/test/image/2018-08-03/e7c38af8b46a9b55f768b4928edb7453.jpg",
						imgHeight:0,
						imgWidth:0,
						isPlayed:false,
						size:218443
					},
					{
						duration:0,
						fileId:"6035",
						fileName:"tmp_34c42c14e479387ebbd95a632e0f974c.jpg",
						fileUrl:"https://cdnstatic.ziwork.com/test/image/2018-08-03/e7c38af8b46a9b55f768b4928edb7453.jpg",
						imgHeight:0,
						imgWidth:0,
						isPlayed:false,
						size:218443
					}
				],
				isFavor:0,
				isSelf:0,
				modelType:"circle",
				releaseTime:1531723628,
				releaseUser:{
					avatar:"http://thirdwx.qlogo.cn/mmopen/t71P7zDFia457UdHe1ibUyaheQgOicyAnptmTjJZHa5IcHAtic7rO2Cw79iaIX0XZDYgeFnXvdXEDODCwIjr6m4NahibaEhXEibRia5h/132",
					career:"测试/背锅侠盗猎",
					gender:2,
					office:"排骨好吃",
					realName:"火姐",
					role:{title: "塔主", code: "master", isShow: 1},
					userI:"85994e9fb90e1fbe8b112230e9db3111",
					workTimeName:"12年"
				},
			}
    
    communityId = "aa111e6adee61456f37ae317570774e2"
  	isPunch = 0	//是否已经打卡
  	
  	toPunch(){
//		alert("我是要跳转去打卡页面的")
		this.$router.push({path:`/PunchEditing?courseId=${this.courseId}`})
  	}
  	
  	toPunchList(){
  		this.$router.push(`/PunchList`);
  		return;
  	}
  	
  	//播放视频
  	playVideo(){
  		this.video.currentTime = 0
	    this.video.src = "https://cdnstatic.ziwork.com/test/video/2018-05-29/68446a2ea39c53ec66ad0a1e012ada3d.mp4"//src="https://cdnstatic.ziwork.com/test/video/2018-05-29/68446a2ea39c53ec66ad0a1e012ada3d.mp4"
	    console.log(this.video.currentTime,"我是视频对象")
	    this.videoPlay = false
	    this.video.play()
  	}
  	
  	mounted () {
	    this.video = this.$refs['video']
	  }
  }
</script>

<style lang="less" scoped>
	.Lesson{
		padding-bottom: 49px;
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
			/*课节视频*/
			.Lesson-video{
				margin-top: 28px;
				padding: 0 20px;
				position: relative;

      & .placeholder {
      		position: absolute;
      		top: 0;
      		left: 20px;
	        width: 335px;
	        height: 187px;
	        background: rgba(0, 0, 0, .8) url('./../../assets/icon/video-play.png') no-repeat center;
	        background-size: 35px 35px;
	
	        & img {
	          width: 100%;
	          height: 100%;
	        }
	      }
	
	      & video {
	        width: 100%;
	        height: 187px;
	      }
			}
			/*音频内容*/
			.content-audio{
				display: flex;
				justify-content: center;
				align-items: center;
				.audio-wrapper{
					width: 335px;
					height: 60px;
					border-radius: 30px !important;
					background-color: RGBA(255, 226, 102, 0.38);
				}
			}
			/*课节富文本*/
			.module-content{
				box-sizing: border-box;
				padding: 0 20px;
				margin-top: 30px;
				width: 100%;
			}
		}
		/*本节打卡任务*/
		.Lesson-task{
			
			.content-txt{
				width: 100%;
			}
			.content-img{
				img{
					
				}
			}
		}
		/*优秀打卡区*/
		.Lesson-punch,.all-punch{
			
			/*优秀打卡标签*/
			.Excellent-punch{
				width: 100%;
				.Excellent-punch-title{
					padding-left: 15px;
					height: 22px;
					width: 100%;
					position:relative; 
					margin-bottom: 10px;
					&::before{
						content: '';
						position: absolute;
						top: 2.5px;
						left: 0;
						width: 5px;
						height: 17px;
						background-color: #FFE266;
					}
				}
			}
			/*底部展开按钮*/
			.Expand-btn{
				width: 100%;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				color: #354048;
				background-color: rgba(255, 226, 102, 0.16);
				border-radius: 20px;
				&>span{
					padding-left: 7px;
				}
			}
			>.dynamic-item{
				border-bottom: 1px solid transparent;
				&:last-child{
					margin-top: 50px;
				}
			}
		}
		.hr{
			margin-left: -20px;
			width: 375px;
			height: 1px;
			background: #EDEDED;
		}
		
		/*所有打卡*/
		.all-punch{
			padding: 0 20px;
			margin-top: 50px;
			.all-show{
				margin-bottom: 50px;
			}
		}
		/*课节底部按钮区*/
		.Lesson-footer{
			width: 100%;
			height: 49px;
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 9998;
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
		/*头部标题样式*/
		.headerBox{
			width: 100%;
			height: 54px;
			background-color: #C9C9C9;
			margin-bottom: 30px;
			position: relative;
			.title-pic1{
				width: 330px;
				height: 49px;
				border: 1.5px solid #354048;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1;
				text-align: center;
				background-color: #FFFFFF;
				.txt{
					display: inline-block;
					text-align: center;
					line-height: 50px;
					font-size: 18px;
					font-weight: 700;
					color: #354048;
					padding: 0 19px;
					position: relative;
					&::before{
						content: '';
						position: absolute;
						top: 24px;
						left: -27.5px;
						width: 27.5px;
						height: 1.5px;
						background-color: #929292;
					}
					&::after{
						content: '';
						position: absolute;
						top: 24px;
						right: -27.5px;
						width: 27.5px;
						height: 1.5px;
						background-color: #929292;
					}
				}
			}
			.title-pic2{
				width: 330px;
				height: 49px;
				border: 1.5px solid #354048;
				background-color: #FFE266;
				position: absolute;
				left: 5px;
				top: 5px;
				z-index: 0;
			}
		}
		
	}
</style>