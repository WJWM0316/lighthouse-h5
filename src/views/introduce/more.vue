<template>
	<div class="community-more">
		
		<!-- <scroll  @refresh="undefined" @pullup="handlePullup" :is-none-data="pagination.end">
		</scroll> -->

    <scroller lock-x height="100%" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"  :scroll-bottom-offst="200">
      <div class="box2">
  			<div class="block more-classmate" v-if="role&&role.length>0">
  				<img class="icon_4" src="../../assets/icon/icon_list_number@3x.png" />
  				<p>塔主和Ta的小伙伴们 <span>({{role.length}}人)</span></p>
  				<ul class="classmateList">
  					<li class="classmatePerson" v-for="item,index in role" @click.prevent.stop="goUserDetail(item.userId)" v-if="index < 2 || !teachOp">
  						<div class="classmate-imgBox">
  							<img class="titleImg" :src="item.avatar"/>
  						</div>
  						<div class="classmate-master">
  							<span class="classmate-name">{{item.realName}}
  								<span class="label" v-text="item.identityAuthority.title "></span>
  							</span>
  							<span class="classmate-career" v-if="item.career">{{item.career}}</span>
  						</div>
  					</li>
  				</ul>

  				<div class="open_blo" v-if="role.length>5" @click.prevent.stop="opTeach"> 
  					<template v-if="teachOp">
  						展开
  						<img class="open_icon" src="../../assets/icon/btn_levea_copy@hhx.png"/>
  					</template>
  					<template v-if="!teachOp">
  						收起
  						<img class="open_icon" src="../../assets/icon/btn_enter copy@hhx.png"/>
  					</template>
  				</div>
  			</div>

  			<!--优秀成员-->
  			<div class="block more-classmate excellent" v-if="excellent&&excellent.length>0">
  				<img class="icon_4" src="../../assets/icon/icon_list_gm.png" />
  				<p>优秀成员<img class="exe_ques" src="../../assets/icon/btn_inf_outstanding@3x.png" @click.prevent.stop="openHint" /></p>
  				<ul class="classmateList">
  					<li class="classmatePerson" v-for="item,index in excellent" @click.prevent.stop="goUserDetail(item.userId)" v-if="index<3">
  						<div class="classmate-imgBox" >
  							<img class="titleImg"  :src="item.avatar"/>
  							<img class="rankImg" v-if="index==0" src="../../assets/icon/rank_1.png"/>
  							<img class="rankImg" v-else-if="index==1" src="../../assets/icon/rank_2.png"/>
  							<img class="rankImg" v-else-if="index==2" src="../../assets/icon/rank_3.png"/>
  						</div>
  						<div class="classmate-master">
  							<span class="classmate-name">{{item.realName}}</span>
  							<span class="classmate-career" v-if="item.career">{{item.career}} | {{item.office}} </span>
  						</div>

  						<div class="exce_msg" v-if="item.signIn">
  							<p class="msg_p"><span class="exce_num">{{item.signIn}}</span>次</p>
  							<p class="msg_p">优秀打卡</p>
  						</div>
  					</li>
  				</ul>
  			</div>
  			<!--灯塔成员-->
  			<div class="block more-classmate" v-if="classmate&&classmate.length>0">
  				<img class="icon_4" src="../../assets/icon/icon_list_number@3x.png" />
  				<p>灯塔成员 <span>({{total}}人)</span></p>
  				<ul class="classmateList">
  					<li class="classmatePerson" v-for="item in classmate" @click.prevent.stop="goUserDetail(item.userId)">
  						<div class="classmate-imgBox">
  							<img class="titleImg" :src="item.avatar"/>
  							<!-- <img class="classmate-sex" v-if="item.gender"
  	             				:src="item.gender === 1 ? boyImg : girlImg"/> -->
  						</div>
  						<div class="classmate-master">
  							<span class="classmate-name">{{item.realName}}<span class="label" v-if="item.identityAuthority.title==='管理员'">管理员</span></span>
  							<span class="classmate-career" v-if="item.career">{{item.career}} | {{item.office}} </span>
  						</div>
  					</li>
  				</ul>
  			</div>

  			<div class="listLoad" v-if="onFetching && pagination.busy">
  				<load-more tip="loading"></load-more>
  			</div>
      </div>
    </scroller>

    <hint-msg 
    	:isHintShow = isHintShow 
    	:msg = hintData
    	@cloHint = cloHint
    ></hint-msg>
	</div>

	
</template>

<script>
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import { getAskInfoApi, getCommunityApi,classmatesApi } from '@/api/pages/pageInfo';
	import Scroll from '@/components/scroller'
	import hintMsg from '@/components/hintMsg/hintMsg'
	import ClassmateItem from '@/components/classmateItem/classmateItem';
	import ListMixin from '@/mixins/list'
	import { Scroller,LoadMore } from 'vux'

	@Component({
	  name: 'home-index',
	  components: {
	    ClassmateItem,
	    Scroller,
	    LoadMore,
	    hintMsg
	  },
	  mixins: [ListMixin]
	})
	export default class HomeIndex extends Vue {
		id = ''
		master = {}
		role = []
		classmate = []
		excellent = []
		total = 0
		girlImg = ""
		boyImg = ""
		defaultImg = ""
		community = {}
		teachOp = true

		onFetching = false
		isLoad = false

		isHintShow = false //弹窗
		hintData = {
			title: '如何成为优秀学员',
			buttonText: '我知道了',
			content: [
				'1、积极听课，完成每节课的打 卡内容；',
				'2、如果你的打卡内容写的很棒 的话，就会被导师选为“优秀打卡”；',
				'3、累计“优秀打卡”个数前三名 的，就能成为优秀学员；']
		}

		created () {
			this.girlImg = require('../../assets/icon/icon_girl.png') || ''
	    this.boyImg = require('../../assets/icon/icon_boy.png') || ''
	    this.defaultImg = require('../../assets/icon/img_head_default.png') || ''
			this.pageInit()
		}
		async pageInit () {
			let id=this.$route.query;
			this.id=id;
			let that=this;
			let num;
			//申请getCommunityApi获取时间
			getCommunityApi(id).then(res=>{
				that.community=res;
				num=res.joinedNum;
			})
			// 初始化 请求学院列表
			this.pagination.busy = false
			this.getMemberList(1, this.pagination.pageSize, this.id)
		}
		opTeach () {
			this.teachOp = !this.teachOp
		}
		hintMsg () {
			let that = this
			this.$vux.confirm.show({
				title: '完善信息',
				content: '为了和塔友们更好的交流，请先完善你的个人信息～',
				confirmText: '前往完善',
				cancelText: '等会再说',
			  // 组件除show外的属性
			  onCancel () {
			  },
			  onConfirm () {
			  	that.$router.push(`/center/editinfo?come=more`)
			  }
			})
		}

		goUserDetail (userId) {
      this.$router.push({name: 'userInfo-details', params: {userId}})
  	}
	  goTointroduceDetail(userId){
	  	console.log(userId.communityId);
	  	this.$router.push({name: 'introduce-detail', params: {communityId: userId.communityId}})
	  }

		async getMemberList (page, pageSize, id) {
			try {	

	      page = page || this.pagination.page || 1
	      pageSize = pageSize || this.pagination.pageSize

	      const params = {
	        page: page,
	        pageCount: pageSize
	      }
	      let res = await classmatesApi({page:page, pageCount:pageSize, communityId:id.communityId})
	    	this.role = res.role

	    	if (page === 1) {
	    		this.classmate = res.peoples
	    		this.excellent = res.excellent
	    		if(res.myInformation === 0){
	    			//资料不全
	    			this.hintMsg()
	    		}
	    	} else {
	    		this.classmate = this.classmate.concat(res.peoples || [])
	    	}

	    	if(res.peoples.length >= this.pagination.pageSize ){
	    		this.pagination.busy = false
	    	}

	    	this.total = res.total
				this.pagination.page = page
			} catch (error) {
	      console.log(error)
	      this.$vux.toast.text(error.message, 'bottom')
	    }
	  }

  	loadNext () {
      const nextPage = this.pagination.page + 1
      //this.pagination.end = false
      this.getMemberList(nextPage, this.pagination.pageSize, this.id)
    }

	  handleRefresh (loaded) {
	    setTimeout(() => {
	      this.pageInit()
	      loaded('done')
	    }, 500)
	  }

	  /**
	   * 上拉加载
	   */
	  onScrollBottom (loaded) {

      if (!this.onFetching && this.isLoad) {
        // do nothing
      } else {
	      this.isLoad = true
      	if(!this.pagination.busy){
      			this.pagination.busy = true
      		  this.onFetching = true
      		  setTimeout(() => {
      				this.loadNext()
      		    this.onFetching = false
      		    this.isLoad = false
      		  }, 2000)
      	}
      }
	  }

	  cloHint (){
	  	this.isHintShow = false
	  }

	  openHint (){
	  	this.isHintShow = true
	  }
	}
</script>

<style lang="less" scoped type="text/less">
	 @import "../../styles/mixins";

	.hint {
		width:280px;
		background:rgba(255,255,255,1);
		border-radius:8px;
		padding: 0 25px;
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		margin-left: -140px;
		top: 20%;
		border: 1px solid #cccccc;
		.hint_title {
			margin: 33px 0 14px 0;
			text-align: center;
		}
		.content {
			.cont_blo {
				font-size: 16px;
				font-family:PingFangSC-Light;
				color:rgba(53,64,72,1);
				line-height: 20px;
				text-align: left
			}
		}
		.btn {
			margin-top: 20px;
			height: 60px;
			line-height: 60px;
			text-align: center;
			font-size: 17px;
			font-family:PingFangSC-Regular;
			color:rgba(215,171,112,1);
		}
	}
	.open_blo {
		width: 335px;
		height: 40px;
		background: rgba(248,248,248,1);
		border-radius: 40px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size:15px;
		font-family:PingFangSC-Light;
		color:rgba(102,102,102,1);
		.open_icon {
			width: 20px;
			height: 20px;
			margin-left: 8px;
		}
	}
	.community-more{
		height: 100%;
  	box-sizing: border-box;
  	background: #f8f8f8;
  	.block {
  		background: #ffffff;
  	}
		& .label {
      color: #d7ab70;
      font-size: 12px;
      padding: 0 6px;
      margin-left: 8px;
      line-height: 18px;
      border-radius: 50px;
      border: 1px solid #D7AB70;/*no*/
      display: inline-block;
      text-align: center;
      box-sizing: border-box;
      font-weight: 300;
    }
		/*人物列表样式*/
		& .more-parner, & .more-classmate{
			box-sizing: border-box;
			width: 100%;
			padding: 20px;
			.icon_3 {
				margin-top: -7px;
			}
			.icon_4 {
				margin-top: -5px;
			}
			& img{
				width: 20px;
				height: 20px;
				display: inline-block;
			}
			
			p{
				margin-left: 10px;
				display: inline-block;
				font-size: 16px;
				color: #929292;
				line-height: 20px;
				
				span{
					font-size: 16px;
					line-height: 20px;
					margin-left: 3px;
				}
				.exe_ques {
					position: relative;
					margin-left: 6px;
					margin-top: -3px;
				}
			}
			
			& .guestList, & .classmateList{
				/*height: 128px;*/
				padding: 20px 0px 0px 0px;
				
				.guestListBox{
					overflow-y: auto;
					white-space: nowrap;
					&:last-child{
						margin-right: 0;
					}
					
					.guestListPerson{
						display: inline-block;
						width: 70px;
						margin-right: 20px;
						/*text-align: center;*/
						
						.name{
							display: inline-block;
							overflow: hidden;
							white-space: nowrap;
							font-size: 14px;
							color: #354048;
							text-align: center;
							width: 70px;
							height: 18px;
							line-height: 18px;
							text-overflow: ellipsis;
						}
						
						& .imgBox{
							width: 60px;
							height: 60px;
							margin: 0 auto;
							margin-bottom: 7.5px;
							border-radius: 50%;
							border: 1px solid #dcdcdc;
							box-sizing: border-box;
							/*overflow: hidden;*/
							position: relative;
							
							.personTitle{
								width: 32px;
								height: 15px;
								position: absolute;
								//font-family: PingFangSC-Light;
								font-weight: 300;
								bottom: -2.5px;
								left: 50%;
								transform: translateX(-50%);
								background: #FFE266;
								border-radius: 83px;
								text-align: center;
								font-size: 10px;
								line-height: 15px;
								color: #354048;
								
							}
							
							img{
								border-radius: 50%;
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}
		}
		
		& .more-classmate{
			border-bottom: none;
			
			& .classmateList{
				
				& .classmatePerson{
					margin-bottom: 30px;
					display: flex;
					align-items: center;
					
					.classmate-imgBox{
						display: inline-block;
						flex-grow: 0;
						position: relative;
						width: 50px;
						height: 50px;
						border-radius: 50%;
						.titleImg{
							border-radius: 50%;
							width: 100%;
							height: 100%;
						}
						
						.classmate-sex{
							position: absolute;
							bottom: 0;
							right: 0;
							width: 18px;
							height: 18px;
							border-radius: 50%;
						}
						.rankImg {
							width: 21px;
							height: 21px;
							background:rgba(238,203,95,1);
							position: absolute;
							right: 0;
							bottom: 0;
							border-radius: 50%;
							overflow: hidden;
							font-size:14px;
							font-family:Arial-BoldMT;
							color:rgba(255,255,255,1);
							line-height:21px;
							text-align: center;
						}
					}
					
					& .classmate-master{
						width: 250px;
						padding-left: 15px;
						flex-grow: 0;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						flex: 1;
						align-items: center;
						.classmate-name{
							display: block;
							font-size: 16px;
							color: #354048;
							line-height: 20px;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.classmate-career{
							//font-family: PingFangSC-Light;
							font-weight: 300;
							display: inline-block;
							width: 100%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-size: 14px;
							color: #929292;
							line-height: 18px;
						}
					}
				}
			}
			/*classmateList*/

			&.excellent {
				.exce_msg {
					display: flex;
					flex-direction: column;
					margin-left: 10px;
					.msg_p {
						width: 60px;
						text-align: center;
						font-size: 12px;
						font-family:PingFangSC-Light;
						color:rgba(146,146,146,1);
						line-height:16px;
						.exce_num {
							font-size: 24px;
							font-family:PingFangSC-Medium;
							color:rgba(215,171,112,1);
							line-height: 28px;
							margin-right: 3px;
						}
					}
				}

			}
		}
	}
</style>