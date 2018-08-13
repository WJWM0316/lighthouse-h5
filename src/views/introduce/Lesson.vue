<template>
	<!--课节页面-->
	<div class="Lesson" v-if="communityCourse">
		<!--头部图片标题区-->
		<div class="Lesson-header">
			<img class="header-photo" :src="communityCourse.coverPicture"/>
			<div class="header-title">
				01、围绕用户价值，最大化你的运营产出
			</div>
		</div>
		<!--富文本区-->
		<div class="Lesson-module">
      <div class="module-header">
      	<div class="head-photobox">
      		<img :src="communityCourse.people.headimgurl"/>
      		<span class="name">{{communityCourse.people.realname}}</span>
      	</div>
      	<div class="date">{{communityCourse.createTime*1000 | date('YYYY-MM-DD')}}</div>
      </div>
      <!--视频-->
      <div class="Lesson-video" @click.stop="playVideo" v-if="communityCourse.av && communityCourse.av.type==='video'">
      	<video controls ref="video"></video>
      	<div class="placeholder" v-show="videoPlay">
          <!--背景图-->
          <!--<img />-->
        </div>
      </div>
      <!-- 音频 -->
      <div :class="{'content-audio': true, 'not-played': !item.files[0].isPlayed}" v-if="communityCourse.av && communityCourse.av.type==='voice'">
        <audioBox
          :source="item.files[0]" 
          :touerImg="item.files[0].avatar"
          :isDetailCon='false'
          ></audioBox>
      </div>
      <div class="module-content h5-code" @click.stop="readPic($event)" v-html="communityCourse.details">
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
			<div class="content-txt" v-html="communityCourse.punchCardTitle">
			</div>
			<div class="content-img">
				<!--<img v-for="item in community_course.punch_card_img_info" :src="item.picture_url" alt="" />-->
				<div class="content-images">
          <!-- 图片为 1 张时 -->
          <div class="item-image one" v-if="communityCourse.punchCardImgInfo && communityCourse.punchCardImgInfo.length === 1">
            <img :src="communityCourse.punchCardImgInfo[0].pictureUrl || '../../assets/icon/img_head_default.png'" @click.stop="previewImage(communityCourse.punchCardImgInfo[0].pictureUrl)" />
          </div>

          <!--  图片为 多 张时  -->
          <div class="item-image" v-for="file in communityCourse.punchCardImgInfo" v-else>
            <img :src="file.pictureUrl || '../../assets/icon/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.pictureUrl)" />
          </div>
        </div>
			</div>
		</div>
		<!--本节任务结束-->
		<!--优秀打卡区-->
		<div class="Lesson-punch">
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
			<lessondynamicItem
				 v-for="item in excellentPunchList"
				 :item="item"
         :showDelBtn="false"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="true"
         :disableContentClick="false"
         @disableOperationEvents="operation"
      ></lessondynamicItem>
      <div class="Expand-btn" @click.stop="toPunchList('excellent')">查看所有优秀打卡 <span>({{excellentPunchList.length}})</span></div>
		</div>
		<!--所有打卡区-->
		<div class="all-punch">
			<div class="Excellent-punch">
				<div class="Excellent-punch-title">所有打卡</div>
			</div>
			<div class="hr"></div>
			<lessondynamicItem
				 v-for="item in peopleCourseCardList"
				 :item="item"
         :showDelBtn="false"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="true"
         :disableContentClick="false"
         @disableOperationEvents="operation"
      ></lessondynamicItem>
      <div class="Expand-btn all-show" @click.stop="toPunchList('all')">查看所有打卡 <span>({{peopleCourseCardList.length}})</span></div>
		</div>
		
		<!--底部打卡按钮区-->
		<div class="Lesson-footer" v-if="isPunch !== 0">
			<div class="toPunch" @click.stop="toPunch">
				去打卡
			</div>
		</div>
		<div class="Lesson-footer" v-else>
				<div class="peacock">炫耀一下</div><span class="line"></span>
				<div class="mine" @click.stop="toMindDetail(communityCourse.peopleId,communityCourse.id)">我的打卡</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
  import Component from 'vue-class-component'
	import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
  import audioBox from '@/components/media/music'
  import WechatMixin from '@/mixins/wechat'
  import { lessonContentApi, getCourseCardListApi } from '@/api/pages/pageInfo'
  @Component({
    name: 'Lesson',
    components: {
      lessondynamicItem,
      audioBox
    },
    computed: {
    	
    },
    watch: {
    	communityCourse (val, old) {
    		this.item = {
    			files:[{
						duration:val.av.duration,
						fileId:String(val.av.fileId),
						fileUrl:val.av.fileUrl,
						avatar:val.people.avatar
			    }]
    		}
    		console.log(this.item,"我是新数据")
    	},
    },
    mixins: [WechatMixin],
  })
  export default class Lesson extends Vue {
  	video = '' //视频
  	videoPlay = true //视频是否在播放
  	showIdentification = true
    disableOperationArr = ['comment']
    isPlayList = false
    //富文本虚拟数据
    intro = '<p>社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍社区介绍</p><p><img src="https://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/Uploads/static/picture/2018-08-08/2d6e172b6cbecf6c9de11727d89d8d0f.png" alt="商业课-推广海报" style="max-width:100%;"><br></p><p><br></p>'

    //音频数据
    item = {}
    //所有打卡数据
    peopleCourseCardList = ""
    
    //优秀打卡
    excellentPunchList = ""
    
    
    //最新课节信息
    communityCourse = ''
    
    communityId = ""
  	isPunch = 0	//是否已经打卡
  	
  	//去打卡编辑页
  	toPunch(){
			this.$router.push({path:`/PunchEditing?courseId=${this.courseId}`})
  	}
  	
  	//去个人打卡详情页
  	toMindDetail(peopleId,courseId){
  		console.log(peopleId,courseId,"我是个人信息")
  		this.$router.push({path:'/PunchDetails',query:{courseId:courseId.courseId,peopleId:peopleId}});
  	}
  	
  	//去打卡内容列表页
  	toPunchList(txt){
  		this.$router.push(`/PunchList?toList=${txt}`);
  		return;
  	}
  	//预览富文本图片
    readPic(e){
    	if(e.target.tagName==='IMG'){
    		let urls = [];
    		urls.push(e.target.src)
    		let img=String(e.target.src);
    		let parma={
    			urls,
    			img
    		}
    		console.log(img,"我是图片路径信息")
    		this.wechatPreviewImage(parma).then().catch(e=>{console.log(e)})
    	}
    }
    //预览普通图片
	  previewImage (img) {
	    const files = this.communityCourse.punchCardImgInfo
	    let urls = []
	    files.forEach((item) => {
	      urls.push(item.pictureUrl)
	    })
	    let parma={
	    	eventType: 'previewImage',
				urls,
				img
			}
			console.log(img,"我是图片路径信息")
  		this.wechatPreviewImage(parma).then().catch(e=>{console.log(e)})
	  }
  	//播放视频
  	playVideo(){
  		this.video.currentTime = 0
	    this.video.src = "https://cdnstatic.ziwork.com/test/video/2018-05-29/68446a2ea39c53ec66ad0a1e012ada3d.mp4"//src="https://cdnstatic.ziwork.com/test/video/2018-05-29/68446a2ea39c53ec66ad0a1e012ada3d.mp4"
	    console.log(this.video.currentTime,"我是视频对象")
	    this.videoPlay = false
	    this.video.play()
  	}
  	
  	created(){
  		Promise.all([lessonContentApi(),getCourseCardListApi()]).then((res)=>{
  			console.log(res,"请求回来的数据")
  			this.communityId = res[0].communityId
  			this.communityCourse = res[0].communityCourse
  			this.peopleCourseCardList = res[1].peopleCourseCardList
  			this.excellentPunchList = res[1].excellentPeopleCourseCardList
  		}).catch((e)=>{
  			console.log(e,"3333333333333333333")
  		})
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
						border-radius: 50%;
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
				margin-top: 28px;
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
				& .content-images {
		      margin-top: 10px;
		      width: 335px;
					// margin-left:7%;
		      display: flex;
					// justify-content:space-between;
		      flex-flow: row wrap;
		
		      & > .item-image {
		        margin-top: 5px;
		        margin-left: 5px;
		        width: 108px;
		        height: 108px;
		        text-align: center;
						flex-grow:0;
						
		
		        &:first-of-type, &:nth-of-type(3n + 1) {
		          margin-left: 0;
		        }
		
		        & img {
		          background: #f9f9f9;
		          width: 100%;
		          height: 100%;
		          vertical-align: middle;
		        }
		      }
		      & > .item-image.one {
		        width: 136px;
		        height: 136px;
		      }
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
				&:last-child{
					border-bottom: 1px solid transparent;
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
			background-color: #FFFFFF;
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