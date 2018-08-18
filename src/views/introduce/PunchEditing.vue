<template>
	<!--打卡发表编辑页-->
	<div class="p-body p-publish-content">
		<div class="form-group">
			<textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
			<p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
		</div>

		<div class="images" v-if="addonType === 0 || addonType === 3">
			<div class="item" v-for="(item, index) in images" :key="index">
				<image-item class="image" mode="auto" :src="item.base64Url || item.fileUrl" />
				<button type="button" class="close u-btn" @click="handleDeleteImage(index, item)"><i class="u-icon-delete-image"></i></button>
			</div>
			<a href="#" class="add item" v-if="images.length < lengths.imageMax" @click.prevent.stop="handleAdd"><i class="u-icon-plus"></i></a>
		</div>

		<!-- {{serverIds}}<br>
    {{uploadSuccess}}<br>
    {{images}} -->

		<div class="btn-container">
			<button type="button" class="u-btn-publish" :disabled="!canPublish" @click="handleSubmit">发表</button>
		</div>
		
		<div class="showTask" @click.stop="showTask">本节打卡任务 <img src="../../assets/icon/btn_up_task@3x.png"/></div>
		<div class="taskWindow" v-if="showTaskWindow">
			<div class="taskhead" @click.stop="closeTask">本节打卡任务 <img src="../../assets/icon/btn_packup_task@3x.png"/></div>
			<div class="taskbody">
				<div v-html="taskContent.courseCardTitle"></div>
				<!--图片-->
				<div class="content-img" v-if="taskContent.courseCardFile && taskContent.courseCardFile.length>0">
					<div class="content-images">
	          <!-- 图片为 1 张时 -->
	          <div class="item-image one" v-if="taskContent.courseCardFile && taskContent.courseCardFile.length === 1">
	            <img :src="taskContent.courseCardFile[0].fileUrl || '../../assets/icon/img_head_default.png'" @click.stop="previewImage(taskContent.courseCardFile[0].fileUrl)" />
	          </div>
	
	          <!--  图片为 多 张时  -->
	          <div class="item-image" v-for="file in taskContent.courseCardFile" v-else>
	            <img :src="file.fileUrl || '../../assets/icon/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.fileUrl)" />
	          </div>
	        </div>
				</div>
			<!--图片-->
			</div>
		</div>

		<actionsheet v-model="addActionsConfig.show" :menus="addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
		<wechat-code-modal v-model="wechatCodeModal.show" />
		<div class="Mask" v-if="showTaskWindow" @click.stop="closeTask"></div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import WechatMixin from '@/mixins/wechat'
	import { Actionsheet } from 'vux'
	import WechatCodeModal from '@/components/wechatCodeModal'
	import { setCourseCardContentApi } from '@/api/pages/content'
	import { getEditCourseCardDetailApi } from '@/api/pages/pageInfo.js'
	import { wechatUploadFileApi } from '@/api/common'

	@Component({
		name: 'publish-content',
		components: {
			Actionsheet,
			WechatCodeModal
		},
		mixins: [WechatMixin]
	})

	export default class PunchEditing extends Vue {
		showTaskWindow = false
		// 文本长度
		lengths = {
			textMax: 1000, // 文本最大字数
			imageMax: 9 // 图片最大张数
		}
		
		//打卡任务内容
		taskContent = ''

		// 选择的图片列表，最多9张
		images = []

		form = {
			courseId: '', // 课节id
			content: '', // 文本内容
		}

		// 添加操作
		addActionsConfig = {
			show: false,
			menus: [{
					label: '图片',
					value: 'image'
				},
//				{
//					label: '视频',
//					value: 'video'
//				}
			]
		}

		serverIds = [] // 上传到微信服务器的serverId数组
		uploadSuccess = true

		// 小程序码弹窗
		wechatCodeModal = {
			show: false
		}

		sendOK = false

		// 图文类型： 0:无文件(文本) 1:音频 2:视频 3:图片
		get addonType() {
			let type = 0
			if(this.images && this.images.length > 0) {
				type = 3
			} else if(this.videos && this.videos.length > 0) {
				type = 2
			} else {
				// 默认0
				type = 0
			}

			return type
		}

		/**
		 * 是否可点击发布按钮
		 */
		get canPublish() {
			return this.form.content.length > 0 || (this.images && this.images.length > 0)
		}

		//路由离开前
		beforeRouteLeave(to, from, next) {
			console.log(to, "我是要跳转的路由参数")
			next()
		}

		created() {
			getEditCourseCardDetailApi(this.$route.query.courseId,this.$route.query.communityId).then(res=>{
				this.taskContent = res
				this.form.content = res.peopleCourseCardInfo.cardContent?res.peopleCourseCardInfo.cardContent:''
				this.images = [...res.peopleCourseCardInfo.cardContentFile]
//				console.log(this.taskContent,"我是图片的路劲、。。。。。")
			}).catch(res=>{
				console.log(res,"报错信息");
			})
			if(!this.$root.$children[0].audio.paused) {
				this.$root.$children[0].audio.pause()
			}
			this.form.courseId = this.$route.params.courseId
		}

		/**
		 * 选择用户图片上传
		 */
		async chooseCustomImages() {
			try {
				const params = {
					count: this.lengths.imageMax - this.images.length
				}
				const {
					localIds
				} = await this.wechatChooseImage(params)
				const newImages = []
				for(let index in localIds) {
					const localId = localIds[index]
					const {
						localData
					} = await this.wechatGetLocalImgData(localId)
					const item = {
						mediaId: '',
						fileUrl: localId
					}
					if(localData) {
						item.base64Url = localData
					}
					newImages.push(item)
				}
				console.log('newImages:', newImages.map(item => item.base64Url))
				this.images = [...this.images, ...newImages]
			} catch(error) {
				console.log(error)
			}
		}

		/**
		 * 上传多张图片
		 */
		async uploadCustomImages(localIds = []) {
			try {
				const localId = localIds.pop()
				if(localId) {
					this.uploadSuccess = false
					const {
						serverId
					} = await this.wechatUploadImage(localId)
					console.log('----', this.images, localId, serverId)
					this.images.forEach(image => {
						if(image.fileUrl === localId) {
							image.mediaId = serverId
						}
					})
					this.serverIds.push(serverId)
					console.log('====', this.images, this.serverIds)
				}

				if(localIds && localIds.length > 0) {
					this.uploadCustomImages(localIds)
				} else {
					// todo 全部上传到微信服务器成功，通知服务器
					await this.uploadWechatSuccess()
					this.uploadSuccess = true
				}
			} catch(error) {
				console.log(error)
				this.$vux.toast.text(error.message || '网络异常，请重试')
			}
		}

		/**
		 * 文件成功上传到微信服务器，通知服务器
		 */
		async uploadWechatSuccess() {
			try {
				this.serverIds.reverse()
				const params = {
					medias: this.serverIds.map(item => {
						return {
							mediaId: item,
							fileType: 'image'
						}
					}),
					globalLoading: false
				}
				const {
					files
				} = await wechatUploadFileApi(params)
				// 成功后，将所有还剩下的图片对象替换
				for(let fileIndex in files) {
					const file = files[fileIndex]
					for(let index in this.images) {
						const image = this.images[index]
						if(image.mediaId === file.mediaId) {
							this.images[index] = file
							break
						}
					}
				}
				this.serverIds = []
				console.log('转换之后images：', this.images)
			} catch(error) {
				this.$vux.toast.text(error.message, 'bottom')
			}
		}

		/**
		 * 准备发布
		 */
		readyPublish() {
			let New_images = this.images;
			if(this.taskContent.peopleCourseCardInfo.cardContent){
				console.log(New_images,this.taskContent.peopleCourseCardInfo.cardContent,"555555555555555555555555555555")
				for(let i=0;i<this.taskContent.peopleCourseCardInfo.cardContent.length;i++){
					for(let j=0;j<New_images.length;j++){
						if(New_images[j].fileUrl === this.taskContent.peopleCourseCardInfo.cardContent[i].fileUrl){
							console.log('111111111111111111111111')
							New_images.splice(j,1);
							break;
						}
					}
				}
			}
			const localIds = New_images.map(item => item.fileUrl) || []
			console.log(localIds,"555555555555555555555555555555")
			if(localIds.length > 0) {
				//有图片，等待图片上传完成后发布
				this.uploadCustomImages(localIds)
				this.$vux.loading.show({
					text: '上传中...'
				})
				this.$watch('uploadSuccess', function(val) {
					if(val) {
						this.publish()
					}
				})
			} else {
				this.publish()
			}
		}

		/**
		 * 最终发布
		 */
		async publish() {
			try {
				this.$vux.loading.show({
					text: '发布中...'
				})

				let fileId = []
				console.log('准备发布images：', this.images)
					let type = 0;
					let params;
					if(this.images.length>0){
						fileId = this.images.map(item => item.fileId)
						type = 3;
						if(this.form.content){
							//如果上传了文字和图片
							params = {
								courseId: parseInt(this.$route.query.courseId),
								cardContent: this.form.content,
								type: type,
								arrayFileId: fileId,
								globalLoading: false,
								communityId:this.$route.query.communityId
							}
						}else{
							params = {
								courseId: parseInt(this.$route.query.courseId),
								type: type,
								arrayFileId: fileId,
								globalLoading: false,
								communityId:this.$route.query.communityId
							}
						}
					}else{
						//只有文字
						params = {
							courseId: parseInt(this.$route.query.courseId),
							cardContent: this.form.content,
							type: type,
							arrayFileId: fileId,
							globalLoading: false,
							communityId:this.$route.query.communityId
						}
					}
				console.log('生成的fileId：', fileId)
				

				//发布内容
				await setCourseCardContentApi(params)

				this.$vux.toast.text('发布成功', 'bottom')

				if(this.sendOK) {
					// let path=`/introduce/${sessionStorage.getItem("nowCommunity")}/community`;
					// this.$router.replace(path);
					sessionStorage.setItem("isNewLoad", true);
					sessionStorage.setItem("scrollTop", 0);
					this.$router.go(-1)
				} else {
					this.$router.go(-1)
				}
				// this.$router.go(-1)
			} catch(error) {
				this.$vux.toast.text(error.message, 'bottom')
			} finally {
				this.$vux.loading.hide()
			}
		}

		/**
		 * 预览图片
		 */
		handlePreviewImage(image) {
			this.wechatPreviewImage({
				current: image.fileUrl,
				urls: this.images.map(item => item.fileUrl)
			})
		}

		/**
		 * 删除图片
		 */
		handleDeleteImage(index, image) {
			this.images.splice(index, 1)
			this.serverIds.splice(index, 1)
			if(this.images && this.images.length <= 0) {
				// 如果图片全部删除了，则上传状态变成完成
				this.uploadSuccess = true
			}
		}

		/**
		 * 点击添加
		 */
		handleAdd() {
			this.chooseCustomImages()
			//解除注释部分会开启底部弹窗
			if(this.images && this.images.length <= 0) {
				this.addActionsConfig.show = true
			} else {
				if(this.images.length < this.lengths.imageMax) {
					this.chooseCustomImages()
				}
			}
		}

		/**
		 * 点击添加选项item
		 * @param {*} key
		 * @param {*} item
		 */
		handleAddActoinItem(key, item) {
			switch(key) {
				case 'image':
					setTimeout(() => {
						this.chooseCustomImages()
					}, 0)
					break
				case 'video':
					this.wechatCodeModal.show = true
					break
				default:
					break
			}
		}

		/**
		 * 提交表单
		 */
		handleSubmit(e) {
			const self = this
			this.$vux.confirm.show({
				content: '确定要发布？',
				onConfirm() {
					self.readyPublish()
				}
			})
		}
		
		/*展示打卡任务*/
		showTask(){
			this.showTaskWindow = true;
		}
		closeTask(){
			this.showTaskWindow = false;
		}
	}
</script>

<style lang="less" scoped>
	@keyframes task-fade-in {
	  from {
	    opacity: 0;
	    transform: translateY(100%);
	  }
	
	  to {
	    opacity: 1;
	    transform: translateY(0);
	  }
	}
	.p-publish-content {
		/*padding-bottom: 20px;*/
		position: relative;
		padding: 25px;
		.form-group {
			position: relative;
			margin-bottom: 7px;
			padding-bottom: 20px;
			.control {
				width: 100%;
				line-height: 20px;
				font-size: 15px;
				height: 120px;
				border: none;
				resize: none;
			}
			.addon {
				display: block;
				position: absolute;
				right: 0;
				bottom: 0;
				line-height: 20px;
				font-size: 13px;
				color: #bcbcbc;
				&.z-active .current {
					color: #d7ab70;
				}
			}
		}
		.images {
			display: flex;
			margin: 0 -3px -6px;
			flex-flow: row wrap;
			.item {
				position: relative;
				display: block;
				flex: 0 0 auto;
				box-sizing: border-box;
				margin: 0 3px 6px;
				font-size: 0;
				&>.image {
					background: #f1f1f1;
					width: 102px;
					height: 102px;
					line-height: 100px;
				}
				.close {
					position: absolute;
					right: 0;
					top: 2.5px;
					width: 26px;
					height: 26px;
				}
				&.add {
					width: 102px;
					height: 102px;
					line-height: 100px;
					text-align: center;
					border: solid 1px #ededed;
					/* no */
				}
			}
		}
		.btn-container {
			margin: 40px 0px;
			.u-btn-publish {
				padding: 10px;
				background: #ffe266;
				width: 100%;
				line-height: 24px;
				border-radius: 22px;
				font-size: 15px;
				color: #354048;
				&[disabled] {
					opacity: .5;
				}
				&::after {
					content: none;
				}
			}
		}
		/*打卡任务详情*/
		.showTask{
			display: flex;
			align-items: center;
			justify-content: center;
			color: #929292;
			font-size: 14px;
			img{
				padding-top: 2px;
				padding-left: 2px;
				width: 18px;
				height: 18px;
			}
		}
		/*打卡任务窗口*/
		.taskWindow{
			position: fixed;
			bottom:0;
			left: 0;
			box-sizing: border-box;
			width: 100%;
			height: 363px;
			z-index: 9999;
			animation: task-fade-in 300ms ease-in-out;
			.taskhead{
				width: 100%;
				height: 44px;
				background-color: #F8F8F8;
				border-radius: 20px 20px 0 0;
				color:#929292;
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					margin-left: 2px;
				}
			}
			.taskbody{
				background-color: #FFFFFF;
				padding: 20px;
				height: 319px;
				overflow-y: scroll;
			}
			
			/*打卡任务图片*/
			.content-img{
				& .content-images {
		      margin-top: 10px;
		      width: 335px;
		      display: flex;
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
		.Mask{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: #000;
			opacity: 0.5;
			z-index: 8888;
		}
	}
</style>