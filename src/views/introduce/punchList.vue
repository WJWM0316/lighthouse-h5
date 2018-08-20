<template>
	<!--打卡列表页-->
	<div class="PunchList">
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
	</div>
</template>

<script>
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
	import { getCourseCardListApi } from '@/api/pages/pageInfo'
	import moment from 'moment'
	@Component({
		name:'punch-list',
		components: {
      lessondynamicItem
    },
	})
	export default class punchList extends Vue {
		communityId = ""
		CourseCardList=""
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
				}else{
					this.CourseCardList =res.peopleCourseCardList
				}
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
		
	}
</script>

<style lang="less" scoped>
	.PunchList{
		.dynamic-item{
			box-sizing: border-box;
			padding: 0 20px;
		}
	}
</style>