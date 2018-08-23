<template>
	<!--打卡列表页-->
	<div class="PunchList">
		<scroll  :pullupable="false" :refreshable="false" @infinite-scroll="handlePullup" :is-none-data="CourseCardList.length===listLength">
			<lessondynamicItem
				 v-for="(item, index) in CourseCardList"
				 :key = "index"
				 :item="item"
         :showDelBtn="true"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="true"
         :disableContentClick="false"
         @disableOperationEvents="operation"
      ></lessondynamicItem>
    </scroll>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
	import { getCourseCardListApi } from '@/api/pages/pageInfo'
	import moment from 'moment'
	import Scroll from '@/components/scroller'
	@Component({
		name:'punch-list',
		components: {
      lessondynamicItem,
      Scroll
    },
	})
	export default class punchList extends Vue {
		communityId = ""
		CourseCardList=""
		listLength = ""
		page = 0 	//当前页码
		created(){
			this.communityId = this.$route.query.communityId
			let parama = {
  			communityId:this.$route.query.communityId,
  			courseId:this.$route.query.courseId,
  			type:this.$route.query.toList==="all"?2:1,
  			page:this.page,
  			pageCount:20
  		}
			getCourseCardListApi(parama).then(res=>{
				if(this.$route.query.toList === "excellent"){
					this.CourseCardList = res.excellentPeopleCourseCardList
					this.listLength = res.excellTotalCount
				}else{
					this.CourseCardList =res.peopleCourseCardList
					this.listLength = res.totalCount
				}
				
			}).catch(res=>{
				console.log(res,"报错信息。")
				this.$vux.toast.text('加载失败，请重试', 'bottom')
			})
		}
		
		/**
     * 操作事件
     * @param e :{eventType} eventType: 事件名称 itemIndex: 触发对象下标
     */
    operation (e) {
      const {eventType} = e

//    if (this.disableOperationArr && this.disableOperationArr.length > 0) {
//      if (this.disableOperationArr.indexOf(eventType) > -1) {
//        this.$emit('disableOperationEvents', {
//          eventType,
//          itemIndex,
//          isDetail: true
//        })
//        return
//      }
//    }

      const item = this.item

      switch (eventType) {
        case 'comment':
          break
        case 'praise':
          this.reFresh()
          break
        case 'del':
          this.del({item, itemIndex}).then()
          break
        case 'previewImage':
          this.wechatPreviewImage(e).then()
          break
        case 'fileOpen':
          window.location.href = e.url
          break
      }
    }
		
		//刷新打开列表数据
	  reFresh(){
			let parama = {
  			communityId:this.$route.query.communityId,
  			courseId:this.$route.query.courseId,
  			type:this.$route.query.toList==="all"?2:1,
  			page:this.page,
  			pageCount:20
  		}
			getCourseCardListApi(parama).then(res=>{
				if(this.$route.query.toList === "excellent"){
					this.CourseCardList = res.excellentPeopleCourseCardList
				}else{
					this.CourseCardList =res.peopleCourseCardList
				}
			})
		}
	  
	  //上拉事件
	  handlePullup (loaded) {
//	  	alert()
	  	console.log("111111111111111")
			if(this.CourseCardList.length===this.listLength){
				loaded('ended')
				return
			}else{
				this.page+=1;
				let param={
					page:this.page,
					pageCount:20,
					communityId:this.$route.query.communityId,
	  			courseId:this.$route.query.courseId,
	  			type:this.$route.query.toList==="all"?2:1,
				}
				
				this.getCourseCardListApi(param).then(res=>{
					if(this.$route.query.toList === "excellent"){
						this.CourseCardList = [...this.CourseCardList,...res.excellentPeopleCourseCardList]
					}else{
						this.CourseCardList =[...this.CourseCardList,...res.peopleCourseCardList]
					}
					loaded('done')
				}).catch(res=>{
					loaded('done')
					this.$vux.toast.text('加载失败，请重试', 'bottom')
				})
				
			}
    }
		
	}
</script>

<style lang="less" scoped>
	.PunchList{
		height: 100%;
		.dynamic-item{
			box-sizing: border-box;
			padding: 0 20px;
		}
	}
</style>