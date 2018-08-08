<template>
	<!--打卡列表页-->
	<div class="PunchList">
		<lessondynamicItem :item="dynamicList"
         :showDelBtn="false"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="false"
         :disableContentClick="true"
      ></lessondynamicItem>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
	import moment from 'moment'
	@Component({
		name:'punch-list',
		components: {
      lessondynamicItem
    },
	})
	export default class punchList extends Vue {
		communityId = "aa111e6adee61456f37ae317570774e2"
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
	}
</script>

<style lang="less" scoped>
	.PunchList{
		padding: 0 20px;
		box-sizing: border-box;
	}
</style>