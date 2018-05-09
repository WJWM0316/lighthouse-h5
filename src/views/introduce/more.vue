<template>
	<div class="community-more">
		<!-- <scroller  @pullup="handlePullup" :is-none-data="pagination.end" :refreshable="false"> -->
			<!--灯塔介绍-->
			<div class="addon-text">
				<div @click.stop="goTointroduceDetail(id)" class="more-introduce">
					<img class="icon_1" src="../../assets/icon/icon_list_aboutlh@3x_2.png"/>
					<span>灯塔介绍</span>
					<i><img src="../../assets/icon/icon_center_angle_right.png"/></i>
		           <!--<img class="icon" src="../../assets/icon/icon_angle_right_white.png" />-->
				</div>
			</div>
			<!--开塔时间-->
			<div class="more-openTime">
				<img class="icon_2" src="../../assets/icon/icon_list_time@3x.png"/>
				<span>开塔时间</span>
				<!--<p>2018年1月1日-2018年4月8日</p>-->
				<p v-if="community.isAuthor === 1 || community.isJoined === 1">{{community.startTime * 1000 | date('YYYY年M月D日')}}-{{community.endTime * 1000 | date('YYYY年M月D日')}}</p>
				
	           <!--<img class="icon" src="../../assets/icon/icon_angle_right_white.png" />-->
			</div>
			<!--塔主和小伙伴-->
			<div class="more-parner">
					<img class="icon_3" src="../../assets/icon/icon_center_home.png" />
					<p>塔主和Ta的小伙伴们 <span>({{role.length}}人)</span></p>
					<!--塔主和嘉宾列表-->
					<div class="guestList">
						<ul class="guestListBox">
							<!--<li class="guestListPerson" @click.prevent.stop="goUserDetail(item.userId)">
								<div class="imgBox">
									<img :src="master.avatar"/>
									<span class="personTitle">塔主</span>
								</div>
								<span class="name" v-text="master.realName">塔主</span>
							</li>-->
							<!--嘉宾-->
							<li class="guestListPerson" v-for="item in role"  @click.prevent.stop="goUserDetail(item.userId)">
								<div class="imgBox">
									<!--<img src="../../assets/icon/img_wechat_code.png"/>-->
									<img :src="item.avatar"/>
									<span class="personTitle" v-text="item.identityAuthority.title "></span>
								</div>
								<span class="name" v-text="item.realName"></span>
							</li>
						</ul>
					</div>
					<!--塔主和嘉宾列表-->
			</div>
			<!--灯塔成员-->
			
			<div class="more-classmate">
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
							<span class="classmate-career" v-if="item.career">{{item.workTimeName}} | {{item.career}} | {{item.office}} </span>
						</div>
					</li>
				</ul>
			</div>
		<!-- </scroller> -->
	</div>
</template>

<script>
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import { getAskInfoApi, getCommunityApi,classmatesApi } from '@/api/pages/pageInfo';
	import Scroller from '@/components/scroller'
	import ClassmateItem from '@/components/classmateItem/classmateItem';
	import ListMixin from '@/mixins/list'
	@Component({
	  name: 'home-index',
	  components: {
	    ClassmateItem,
	    Scroller
	  },
	  mixins: [ListMixin]
	})
	export default class HomeIndex extends Vue {
		id = ''
		master = {}
		role = []
		classmate = []
		total = 0
		girlImg = ""
		boyImg = ""
		defaultImg = ""
		community = {}

		created () {
			this.girlImg = require('../../assets/icon/icon_girl.png') || ''
	    this.boyImg = require('../../assets/icon/icon_boy.png') || ''
	    this.defaultImg = require('../../assets/icon/img_head_default.png') || ''
			
			this.pageInt()

			
			
			//申请塔主和嘉宾列表
//			getAskInfoApi(id).then(res=>{
//				console.log("请求成功总数据",res)
//				that.master=res.master;
//				that.role=res.role;
//				console.log("嘉宾列表",that.role);
//			});
			
			
		}

		async pageInt () {
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
			this.pagination.end = false
			this.getMemberList(1, 10000, this.id)
		}

		goUserDetail (userId) {
      this.$router.push({name: 'userInfo-details', params: {userId}})
  	}
	  goTointroduceDetail(userId){
	  	console.log(userId.communityId);
	  	this.$router.push({name: 'introduce-detail', params: {communityId:userId.communityId}})
	  }

		async getMemberList (page, pageSize, id) {
			try {	
		  	if (this.pagination.end || this.pagination.busy) {
	        // 防止多次加载
	        return
	      }
	      page = page || this.pagination.page || 1
	      pageSize = pageSize || this.pagination.pageSize

	      const params = {
	        page: page,
	        pageCount: pageSize
	      }
	      this.pagination.busy = true
	      let res = await classmatesApi({page:page, pageCount:pageSize, communityId:id.communityId})
	    	this.role=res.role
	    	if (page === 1) {
	    		this.classmate = res.peoples
	    	} else {
	    		this.classmate = this.classmate.concat(res.peoples || [])
	    	}
	    	this.total = res.total
				this.pagination.page = page
	      this.pagination.pageSize = pageSize
	      this.pagination.total = res.total
	      this.pagination.end = this.isLastPage
	      this.pagination.busy = false
			} catch (error) {
	      console.log(error)
	      this.$vux.toast.text(error.message, 'bottom')
	    }
	  }
		/**
     * 下拉刷新
     */
    handleRefresh (loaded) {
      this.pageInit().then(res => {
        loaded('done')
      })
  	}
  	loadNext () {
      const nextPage = this.pagination.page + 1
      this.getMemberList(nextPage, 8, this.id)
    }
	    /**
	   * 上拉加载
	   */
	  handlePullup (loaded) {
	    setTimeout(() => {
	      this.loadNext()
	      // loaded('done')
	    }, 500)
	  }
	}

</script>

<style lang="less" scoped type="text/less">
	.community-more{
		height: 100%;
    box-sizing: border-box;
		& .more-introduce, & .more-openTime{
			box-sizing: border-box;
			width: 100%;
			padding: 18.5px 18.5px;
			border-bottom: 1px solid #EDEDED;
			
			& img{
				width: 20px;
				height: 20px;
				display: inline-block;
			}
			
			& span{
				margin-left: 15px;
				font-size: 16px;
				color: #354048;
				line-height: 20px;
			}
			
			& i{
				display: inline-block;
				width: 20px;
				height: 20px;
				line-height: 20px;
				float: right;
				
				& img{
					margin-top: -2px;
					width: 80%;
					height: 80%;
					color: #929292;
					line-height: 18px;
				}
			}
			
			& p{
				display: inline-block;
				float: right;
				font-size: 14px;
				color: #929292;
				line-height: 20px;
				
			}
			.icon_1 {
				margin-top: -3px;
			}
			.icon_2 {
				margin-top: -4px;

			}
			
		}
		& .label {
          color: #d7ab70;
          font-size: 12px;
          padding: 0 10px;
          margin-left: 8px;
          line-height: 18px;
          border-radius: 50px;
          border: 1px solid #D7AB70;
          display: inline-block;
          text-align: center;
          box-sizing: border-box;
        }
		/*人物列表样式*/
		& .more-parner, & .more-classmate{
			box-sizing: border-box;
			width: 100%;
			padding: 0 20px;
			margin: 20px 0 0;
			border-bottom: 1px solid #EDEDED;
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
				margin-left: 15px;
				display: inline-block;
				font-size: 16px;
				color: #354048;
				line-height: 20px;
				
				span{
					font-size: 16px;
					color: #354048;
					line-height: 20px;
				}
			}
			
			& .guestList, & .classmateList{
				/*height: 128px;*/
				padding: 20px 0px;
				padding-bottom: 0;
				
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
						}
						
						& .classmate-master{
							width: 250px;
							padding-left: 15px;
							flex-grow: 0;
							.classmate-name{
								display: block;
								font-size: 16px;
								color: #354048;
								line-height: 20px;
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
			}
		
	}
</style>