<template>
  <!-- 朋友圈、帖子、问题 详情 -->
  <div class="all-details" :class="{'pdBtom' : isShow}" v-if="courseCardInfo">
    <scroll @refresh="handleRefresh" @pullup="handlePullup" :is-none-data="navTabName==='comment'?commentList.length === allTotal:courseCardInfo.favorTotal">  
        <div class="header">
          <lessondynamicItem
				 :item="courseCardInfo"
         :showDelBtn="true"
         :communityId="communityId"
         :isFold="true"
         :isNeedHot="true"
         :hideBorder="false"
         :isLesson="false"
         :disableContentClick="false"
         :hideCommentArea="true"
         @disableOperationEvents="operation"
         @praise="reFlashPraise"
         @showEvaluate='showEvaluate'
      ></lessondynamicItem>
        </div>
    
        <div class="container">
          <!-- 评论 -->
          <div class="fixed-box" ref="ceiling-box">
            <div class="ceiling-box" :class="navTabName">
              <span @click="toggle('comment')">评论({{courseCardInfo.commentTotal}})</span>
              <span @click="toggle('praise')">点赞({{classmateList.length}})</span>
            </div>
          </div>
          <template v-if="navTabName === 'comment'">
            <div v-for="item,index in commentList">
              <!-- 热门评论 -->
              <div class="hot-area" v-if="item.isHot === 1 && index === 0">
                <i class="hot-icon"><img src="~ICON/icon_hotcomment@3x.png" alt=""></i>热门评论
              </div>
              <!-- 全部评论 -->
              <div class="hot-area" v-if="item.isHot === 0 && index === hotCommentNum">
                <i class="hot-icon"><img src="../../assets/icon/tab-massage-3@3x.png" alt=""></i>全部评论
              </div>
              <discuss-item 
                  :item="item"
                  :key="index"
                  :itemIndex="index"
                  :showDelBtn="true"
                  :disableUserClick="false"
                  @operation="operation">
              </discuss-item>
            </div>
            <div v-if="allTotal === 0">
              <p class="community-empty-desc fs13">成为第一个评论的人吧~</p>
            </div>
          </template>
          <!-- 点赞 -->
          <template v-else>
          <div class="content-praise">
            <classmate-item v-for="item, index in classmateList"
                            :item='item'
                            :key="index"
                            @tap-one="jump">
            </classmate-item>
            <div v-if="classmateList.length === 0">
              <p class="community-empty-desc fs13">成为第一个点赞的人吧~</p>
            </div>
          </div>
          </template>
        </div>
    </scroll>
    <!-- footer -->
    <div class="footer" v-if="false">
      <div class="page-operation">
        <!-- 点赞按钮 -->
        <button @click="operation({eventType: 'praise'})">
          <img v-if="item.isFavor" class="icon-zan" src="./../../assets/icon/zan_click.png" />
          <img v-else class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
          {{item.favorTotal > 0 ? item.favorTotal : ''}}
        </button>
        <span class="split"></span>
        <!-- 评论按钮 -->
        <button @click="comment({})">
          <img class="icon-pinglun" src="./../../assets/icon/pinglun2@3x.png" />
          {{pagination.total > 0 ? pagination.total : ''}}
        </button>
      </div>
    </div>

    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      :isShow = 'isShow'
                      @input = "blur"
                      @send="sendComment"
                      ref="input"
    ></suspension-input>
    <actionsheet v-model="addActionsConfig.show" :menus="this.courseCardInfo.isExcellentCard?addActionsConfig.menus2:addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import lessondynamicItem from '@/components/lessondynamicItem/lessondynamicItem'
  import discussItem from '@/components/discussItem/discussItem'
  import classmateItem from '@/components/classmateItem/classmateItem'
  import suspensionInput from '@/components/suspensionInput/suspensionInput'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { Actionsheet } from 'vux'
  import { getCourseCardInfoApi, courseCardCommentApi, getCourseCardFavorListApi, getCourseCardCommentListApi, courseCardFavorApi, setExcellentCourseCardApi } from '@/api/pages/pageInfo.js'
//import { getCircleDetailApi, getPostDetailApi, getProblemDetailApi, getCommentListApi, setFavorApi, setSubmitCommentApi, delCommontApi, getFavorListApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'punch-details',
    components: {
      lessondynamicItem,
      discussItem,
      classmateItem,
      Scroll,
      suspensionInput,
      Actionsheet
    },
    computed: {
      item () {
        return this.dynamicList[0] || {}
      }
    },
    watch: {
      isPlayList () {},
      discussItemList () {
      },
      displaySuspensionInput (val) {
        // this.isShow = val
      }
    },
    mixins: [ListMixin]
  })
  export default class punchDetails extends Vue {
  	courseCardInfo = "" //打卡内容
    dynamicList = []
    commentTotal = 0
    favorTotal = 0
    navTabName = 'comment'
    discussItemList = []
    hotCommentTotal = 0
    isShow = true
    allTotal = 0
    navTabName = 'comment'
    commentIndex = -1
    suspensionInputPlaceholder = '来分享你的想法吧～'
    disableOperationArr = ['comment']
    displaySuspensionInput = false
    curData = {} // 评论回来的数据
    modelType = '' // 评论类型
    classmateList = [] // 点赞列表
    commentList = []	//评论列表
    hotCommentNum = 0  //热评数量
    isFavorList = false
    isPlayList = true
    communityId = ''
    
    // 选为优秀打卡或取消优秀打卡
		addActionsConfig = {
			show: false,
			menus: [{
					label: '选为优秀打卡',
					value: 'selected'
				}
			],
			menus2:[{
					label: '取消优秀打卡',
					value: 'disSelect'
				}
			]
		}
    
    
    created () {
    	this.pageInit()
    }
    //----------------评选和取消评选优秀打卡---------------------------
    //调起底部点赞弹窗
  	showEvaluate(item){
  		console.log(item,"我是点击的信息详情")
  		this.addActionsConfig.show = true
  	}
    /**
		 * 点击添加选项item
		 * @param {*} key
		 * @param {*} item
		 */
		async handleAddActoinItem(key, item) {
			let isExcellentCard;
			switch(key) {
				case 'selected':
					isExcellentCard = 1
					break
				case 'disSelect':
					isExcellentCard = 0
					break
				default:
					break
			}
			
			let parama = {
	  		communityId:this.courseCardInfo.communityId,
	  		peopleCourseId:this.courseCardInfo.peopleCourseId,
	  		status:isExcellentCard
	  	}
			console.log(parama,"我是参数。。。。。")
			
			setExcellentCourseCardApi(parama).then(res=>{
	  		console.log("评选成功")
	  		this.$vux.toast.text('评选成功', 'bottom')
	  	}).catch(res=>{
	  		console.log(res,"接口报错")
	  		this.$vux.toast.text('评选失败，请重试', 'bottom')
	  	})
		}
    
    // ------------------- 详情评论区 ----------------------
    operationDetail () {

    }
    // ------------------- 评论区 ----------------------
    operation (e) {
    	console.log(e,"我是带回来的数据")
    	const {eventType, param} = e
////    const {eventType, itemIndex, item, commentType, isDetail} = e
      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          this.comment(param).then()
//        this.courseCardCommentApi(parama).then()
          break
        case 'praise':
          this.praise(param)
          break
        case 'del':
          this.del({item, itemIndex, commentType}).then()
          break
        case 'comment-area':
          this.jumpCommentDetail(param)
      }
    }
    //刷新点赞列表数据
    reFlashPraise(){
    	let param = {
    		peopleCourseId: this.courseCardInfo.peopleCourseId,
    		page:1,
    		pageCount:20
    	}
    	getCourseCardFavorListApi(param).then(res=>{
    		this.classmateList = res
    	})
    }

    /**
     * 获取点赞列表
     */
    getFavorList (params) {
      return getFavorListApi(params)
    }
    /**
     * 跳转详情页
     */
    jump (e) {
      this.$router.push('/userInfo/' + e + '/details')
    }
    jumpCommentDetail (param) {
    	console.log(this.courseCardInfo,"1111111111111");
    	let {item} = param;
      this.$router.push(`/reply/${item.commentId}?peopleCourseId=${this.courseCardInfo.peopleCourseId}`)
    }

    /**
     * 评论
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async comment (param) {
      this.displaySuspensionInput = true
      this.$refs.input.$refs['suspension-input'].focus()
      if (param.type === 2) {
        this.suspensionInputPlaceholder = '回复' + param.item.reviewer.realName + ':'
        this.commentIndex = param.itemIndex
      } else {
        this.suspensionInputPlaceholder = '来分享你的想法吧～'
        this.commentIndex = -1
      }
    }

    getUserId ({res, favor}) {
      if (favor === 1) {
        this.classmateList.splice(0, 0, res)
      } else {
        this.classmateList.forEach((data, index) => {
          if (res.userId === data.userId) {
            this.classmateList.splice(index, 1)
          }
        })
      }
    }
    /**
     * 点赞
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    praise (param) {
    	
    	if(param === undefined){
    		return;
    	}
    	let { item, itemIndex } = param
      let params = '';
      let favor;
      if (item) {
      	let { item, itemIndex } = param
        const {commentId, isFavor} = item
        let favorType = 6
        favor = isFavor ? 0 : 1
        let params= {
		  		isFavor:favor,
		  		type:2,
		  		sourceId: item.commentId //打卡信息id
		  	}
     }
      courseCardFavorApi(params)
      this.commentList[itemIndex].isFavor = favor
      this.commentList[itemIndex].favorTotal += favor ? 1 : -1
      if (favor) {
        this.commentList[itemIndex].favorList = this.commentList[itemIndex].favorList || []
        this.commentList[itemIndex].favorList.splice(0, 0, res)
      } else {
        let tempIndex = ''
        this.commentList[itemIndex].favorList.forEach((item, index) => {
          if (item.userId === res.userId) {
            tempIndex = index
          }
        })
        this.commentList[itemIndex].favorList.splice(tempIndex, 1)
      }
    }

    /**
     * 删除
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async del ({item, itemIndex}) {
      const {commentId} = item
      const _this = this
      const params = {
        id: commentId,    // 删除id
        modelType: 'comment',  // 类型：circle:朋友圈,post:帖子,comment:评论
      }

      this.$vux.confirm.show({
        content: '确定要删除吗？',
        confirmText: '确定',
        cancelText: '取消',
        onCancel () {
        },
        onConfirm () {
          delCommontApi(params).then(res => {            
            if (_this.discussItemList[itemIndex].isHot) {
              _this.hotCommentTotal -= 1
            }
            _this.discussItemList.splice(itemIndex, 1)
            _this.allTotal -= 1
          }).catch(e => {
            _this.$vux.toast.text('删除失败', 'bottom')
          })
        }
      })
    }
    // ------------------------------------------------

    /**
     * 切换nav
     **/
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
        if (targetName === 'praise') {
          let modelType = ''
          this.isShow = false
          modelType = 'circle'
          switch (this.$route.params.type * 1) {
            case 1:
              modelType = 'circle'
              break
            case 2:
              modelType = 'post'
              break
            default:
              modelType = 'problem'
              break
          }
          const params = {
            id: this.$route.params.sourceId,
            modelType: modelType,
            page: 1,
            pageCount: 1000
          }
//        if (!this.isFavorList) {
//          this.getFavorList(params).then(res => {
//            this.classmateList = res.list
//            this.isFavorList = true
//          })
//        }
        } else {
          this.isShow = true
        }
      }
    }

    blur () {
      this.displaySuspensionInput = false
    }
    
    /**
     *请求评论列表数据
     */
    getCourseCardCommentList(){
    	let data = {
    		peopleCourseId: this.courseCardInfo.peopleCourseId, 
    		page:1,
    		pageCount:20
    	}
    	getCourseCardCommentListApi(data).then(res=>{
    		if(res.hotComments){
    			this.hotCommentNum = res.hotComments.length
    			this.commentList = [...res.hotComments]
    		}
    		if(res.comments){
    			this.commentList.push(...res.comments)
    		}
    		
    		
    	}).catch(res=>{
    		console.log(res,"报错信息")
    	})
    }

    /**
     * 发送评论
     * @param data
     */
    async sendComment ({value, commentIndex}) {
//    const item = commentIndex > -1 ? this.discussItemList[commentIndex] : this.dynamicList[0]
//    const {commentId, problemId, circleId} = item
      let sourceType;
      let type =1
      if (this.commentIndex < 0) {
      	type = 1
        sourceType = this.courseCardInfo.peopleCourseId
      }else{
      	type = 2
      	sourceType = this.commentList[this.commentIndex].commentId
      }

      const params = {
      	type: type,
      	id: sourceType,		//对应打卡或评论的id
        peopleCourseId: this.courseCardInfo.peopleCourseId,     // 对应评论类型id
        commentContent: value       // 评论内容
      }
      
      courseCardCommentApi(params).then(res=>{
      	this.getCourseCardCommentList()
      	this.allTotal +=1;
      	this.$vux.toast.text('评论成功', 'bottom')
      }).catch(e => {
        this.$vux.toast.text('评论失败', 'bottom')
        this.curData = {}
      })
      
     /* await setSubmitCommentApi(params).then(data => {
        this.commentIndex = -1
        let page = Math.ceil(commentIndex/20) // 向上取整 用于刷新当前page
        this.pagination.end = false // 初始化数据，必定不是最后一页
        this.getList({ page: page , type: 'comment'})
        this.curData = data
        this.$vux.toast.text('评论成功', 'bottom')
        this.suspensionInputPlaceholder = '来分享你的想法吧～'
      }).catch(e => {
        this.$vux.toast.text('评论失败', 'bottom')
        this.curData = {}
      })*/
    } 
      



    async pageInit () {
    	console.log(this.$route.query,"dasfadsfasdfasdfasdfasd")
    	const { courseId, peopleId } = this.$route.query
      const res = await getCourseCardInfoApi(courseId,peopleId)
      this.courseCardInfo = res
      this.allTotal = res.commentTotal
      this.getCourseCardCommentList()
      this.reFlashPraise()
      console.log(this.courseCardInfo,"我是请求回来的数据")
    }

    // ------------------------------------------------
    /**
     * 朋友圈详情
     **/
    getCircleDetailApi (circleId) {
      return getCircleDetailApi({
        circleId
      })
    }
    /**
     * 帖子详情
     **/
    getPostDetailApi (circleId) {
      return getPostDetailApi({
        circleId
      })
    }
    /**
     * 问题详情
     **/
    getProblemDetailApi (problemId) {
      return getProblemDetailApi({
        problemId
      })
    }
    /**
     * 获取评论列表
     */
    getCommentList (params) {
      return getCommentListApi(params)
    }
    /**
     * 获取点赞列表
     */
    getFavorList (params) {
      return getFavorListApi(params)
    }
    // ------------------------------------------------
    async getList ({page, pageSize} = {}) {
      if (this.pagination.busy) {
        // 防止多次加载
        return
      }
      if (this.pagination.end) {
        this.$vux.toast.text('没有更多数据了', 'bottom')
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      let modelType = ''
      switch (this.$route.params.type * 1) {
          case 1:
            modelType = 'circle'
            break
          case 2:
            modelType = 'post'
            break
          default:
            modelType = 'problem'
            break
      }
      const params = {
        id: this.$route.params.sourceId,
        modelType: modelType,
        page: page,
        pageCount: pageSize
      }

      this.pagination.busy = true
      const navTabName = this.navTabName
      const res = await this.getCommentList(params)
      const {comments, total, hotCommentTotal} = res 
      this.allTotal = total
      if (page === 1) {
        this.discussItemList = comments
      } else {
        this.discussItemList = this.discussItemList.concat(comments || [])
      }
      this.hotCommentTotal = hotCommentTotal
      for (var i = 0; i<hotCommentTotal; i++) {
        this.discussItemList[i].isHot = true
      }
      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = this.allTotal
      this.pagination.end = this.isLastPage
      this.pagination.busy = false
    }

    /**
     * 加载下一页
     */
    async loadNext() {
      const nextPage = this.pagination.page + 1
      await this.getList({ page: nextPage })
    }

    /**
     * 下拉刷新
     */
    handleRefresh (loaded) {
      this.pageInit().then(res => {
        loaded('done')
      })
    }

    /**
     * 上拉加载
     */
    handlePullup (loaded) {
    	if(this.navTabName==="comment"){
//  		this.commentList.length === 
    	}
//    this.loadNext().then(() => { loaded('done') })
    }
  }
</script>
<style lang="less" scoped>
  .all-details {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow: hidden;
    &.pdBtom {
      padding-bottom: 50px;
    }
    & .header {
      padding: 0 20px;
      box-sizing: border-box;
    }
    & .ceiling-box {
      margin: 0 15px;
      display: flex;
      align-items: center;
      color: #929292;
      font-size: 15px;
      border-bottom: solid 1px #dcdcdc; /* no */
      
      & span {
        height: 40px;
        line-height: 40px;
        margin-left: 40px;
        padding: 0 5px;
        transform: translate(0, 1px);

        &:first-of-type {
          margin-left: 0;
        }
      }
      &.comment span:nth-of-type(1),
      &.praise span:nth-of-type(2) {
        color: #354048;
        font-weight: 700;
        position: relative;
      }
      &.comment span:nth-of-type(1):after,
      &.praise span:nth-of-type(2):after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        border-radius: 2px;
        background-color: #ffe266;
      }

      &.fixed {
        position:fixed;
        top:0;
        left:0;
        right:0;
        background:#fff;
        margin-top: 0;
        z-index: 99;
        padding: 0 15px;
        margin: 0; 
      }
    }
    & .hot-area {
      padding-left: 32px;
      font-size: 16px;
      line-height: 40px;
      color: #354048;
      background: #F8F8F8;
      .hot-icon {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 10px;
        img {
          width: 20px;
          height: 20px;
          margin-top: -4px;
        }
      }
    }
    & .container {
      padding-top: 4px;
      & .container-title {
        font-size: 15px;
        font-weight: 700;
        color: #354048;
        padding: 10px 0;
        margin: 0 15px;
        border-bottom: solid 1px #dcdcdc;  /* no */
      }

      & .content-comment {

      }
      & .content-praise {
        padding-right: 15px;
      }
    }
    & .community-empty-desc {
      margin-top: 50px;
      color: #bcbcbc;
      text-align: center;
      margin-bottom: 30px;
    }

    .footer {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;

      & .page-operation {
        display: flex;
        align-items: center;
        border-top: solid 1px #ededed;  /* no */
        background: #FFF;

        & > button　{
          flex: 1 1 auto;
          height: 50px;
          font-size: 15px;
          color: #666666;
          border-style: none;
          outline: none;
          line-height: 1;
          background-color: transparent;
          text-align: center;
        }

        & .split {
          width: 1px;
          height: 20px;
          background-color: #dcdcdc;
        }
      }

      & .icon-zan, & .icon-pinglun {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 2px;
      }
    }
  }
</style>
