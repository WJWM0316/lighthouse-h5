<template>
	<!--打卡列表页-->
	<div class="PunchList">
		<lessondynamicItem
				 v-for="item in CourseCardList"
				 :item="item"
         :showDelBtn="false"
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
		communityId = "aa111e6adee61456f37ae317570774e2"
		CourseCardList=""
		created(){
			
			getCourseCardListApi().then(res=>{
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