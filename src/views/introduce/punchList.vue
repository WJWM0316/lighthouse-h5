<template>
	<!--打卡列表页-->
	<div class="PunchList">
		<lessondynamicItem
				 v-for="item in CourseCardList"
				 :item="item"
         :showDelBtn="true"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="true"
         :disableContentClick="false"
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
				console.log(res,this.$route.query.toList,"7777777777777777")
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
		padding: 0 20px;
		box-sizing: border-box;
	}
</style>