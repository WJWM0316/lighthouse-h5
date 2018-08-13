<template>

  <!-- 大咖精选页 (社区页) -->
  <div class="author" :class="{'big-shot-community': true}">

    <!-- tab -->
    <div :class="{'big-shot-community-title': true, 'circles': showType, 'forum': !showType, 'fixed2': true}" v-if="isCommunityTitleFixed">
      <a href="#" class="item" @click.prevent.stop="toggle(1)"><span>塔主内容</span></a>
      <a href="#" class="item" @click.prevent.stop="toggle(0)"><span>成员交流</span></a>
    </div>

    <scroll :pullupable="true" :infinite-scroll="true" @refresh="handleRefresh" @infinite-scroll="handlePullup" @scroll="scroll" :is-none-data="pagination.end">
      <!-- header -->
      <div class="header">
      	
      	<!--详情页头部组件-->
        <community-card class="community-item" :community="pageInfo" :type="2" :isEntentr="false" >
        </community-card>
        <!--详情页头部组件-->

        <div class="share-group">
          <div class="group_wrap">
            <button type="button" class="home u-btn" @click="toHome"><i class="u-icon-community-home"></i></button>
            <button type="button" class="invite u-btn" v-if="!pageInfo.isAudit && pageInfo.isSell === 2" @click="showSell = true">邀请函</button> 
            <button type="button" class="money u-btn" v-else-if="!pageInfo.isAudit && pageInfo.isSell === 1"  @click="showSell = true">
              ¥{{pageInfo.sellPrice}}
            </button>
            <button type="button" class="share u-btn" v-else @click="showShare = true"><i class="u-icon-share-community"></i></button>
          </div>
          <span class="money_other" v-if="!pageInfo.isAudit && pageInfo.isSell === 1">
            分享赚
            <img src="../../assets/icon/bg_share.png" />
          </span>
        </div>
      </div>

      <!-- container -->
      <div class="container">
        <!-- 主体内容块 -->
        <div class="fixed-box" ref="community-title" v-if='pageInfo.isCourse == 3'>
          <div :class="{'big-shot-community-title': true, 'circles': showType, 'forum': !showType}" v-if="!isCommunityTitleFixed">
            <a href="#" class="item" @click.prevent.stop="toggle(1)"><span>课程内容</span></a>
            <a href="#" class="item" @click.prevent.stop="toggle(0)"><span>成员交流</span></a>
          </div>
        </div>

        <div class="big-shot-community-content" >
          <!-- <div class="module-content" v-if="dynamicList && dynamicList.length > 0"> -->
            <template v-if="showType">
              
              <course-content 
                :courseList="dynamicList" 
                @lessSetSort="lessSetSort" 
                :sort="lessSort" 
                @getLessPage="getLessPage" 
                :communityId=communityId 
                :lastStudy = lastStudy 
                @toLastStudy =toLastStudy></course-content>
              <!-- 相关推荐 -->
              <div class="module relevant" v-if="relevantList.length > 0">
                <div class="module-title">
                  <p>相关推荐</p>
                  <div class="hr"></div>
                </div>
                <div class="module-content">
                  <community-info-card class="community-item" v-for="item in relevantList" :key="item.communityId" :community="item" @tap-card="handleTapCard(item)" />
                </div>
              </div>

            </template>
            <template v-else>

              <div class="course_top" v-if="dynamicList.length>0">
                <div class="top_left">共有<span class="le_sp">{{dynamicList.length}}</span>篇帖子</div>
                <div class="top_right" @click.prevent.stop="setSort">
                  <img class='right_icon' src="./../../assets/icon/bnt_order@3x.png"/>
                  <span v-if="userSort == 1">倒序</span>
                  <span v-else>正序</span>
                </div>
              </div>
              <div class="recommend_list" v-if="topList.length>0" v-for="item,index in topList">
                <div class="rem_blo" @click.stop="toDetails(index)">
                  <img class='blo_icon' src="./../../assets/icon/icon_topping@3x.png"/>
                  <p class="blo_tit">{{item.tit}}{{item.content}}</p>
                </div>
              </div>
              <dynamic :dynamicList="dynamicList"
                       :showDelBtn="true"
                       :isNeedHot="true"
                       :communityId="communityId"
                       :isUser="true"
                       :showIdentification="showIdentification"
                       :disableOperationArr="disableOperationArr"
                       @disableOperationEvents="operation"
                       @saveAudio="controlAudio"
                       @opMember="opMember"
              ></dynamic>
            </template>
            
          <!-- </div>
          <div class="blank" v-else>
            <div v-if="pagination.end">
              <img src="http://zike-uploads-test.oss-cn-shenzhen.aliyuncs.com/Uploads/static/picture/2017-12-14/20171214171938.png" />
              <p>暂时没有内容～</p>
            </div>
          </div> -->
        </div>

      </div>
    </scroll>

    <!-- footer -->
    <div class="footer" v-show="!displaySuspensionInput">
    	<!--在这里增加嘉宾判断 -->
      <div v-if="isAuthor || isKayo=='guests'" class="author-operation">
        <button @click="question" v-if="this.pageInfo.isCourse===3">
          <span class="desc"><img src="../../assets/icon/bnt_askquestion@3x.png"/>回答问题<i class="answer-count _" v-if=" pageInfo['answerTotal']> 0">{{pageInfo['answerTotal']}}</i></span>
        </button>
        <button @click="release"><img src="../../assets/icon/bnt_post@3x.png"/>发帖</button>
      </div>
      <div class="ask-warp" v-else>
        <!--4.25改版-->
        <button @click="postQuestions" v-if="this.pageInfo.isCourse===3">
          <span class="desc"><img src="../../assets/icon/bnt_askquestion@3x.png"/>提问</span>
        </button>
        <button @click="posted" class="post-tip" v-if="isKayo=='manager' && type===1"><img src="../../assets/icon/bnt_post@3x.png"/>发帖</button>
        <button @click="posted" class="post-tip" v-else><img src="../../assets/icon/bnt_post@3x.png"/>发帖</button>
      </div>
    </div>
    <!--分享弹窗-->
    <share-dialog :isShow="showShare" @close-share="closeShare"
                  :shareType="1"></share-dialog>
    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      :isShow = "isShow"
                      @send="sendComment"
                      ref="input"
    ></suspension-input>

    <actionsheet v-model="releaseActionsheet.show" :menus="pageInfo.isCourse===3?releaseActionsheet.menus:releaseActionsheet_no.menus" show-cancel @on-click-menu="handleReleaseActionsheetItem" />


    <!-- 帖子置顶删除 -->
    <actionsheet v-model="userOpActionsheet.show" :menus="userOpActionsheet.menus" show-cancel @on-click-menu="handleUserOpActionsheetItem" />

    <div class="home-mask" v-if="showSell">
      <div class="sell-container">
        <i class="u-icon-close icon-close" @click="showSell = false"></i>
        <div class="Qr">
          <img :src="qrSrc">
        </div>
        <p>长按识别二维码，关注公众号即可获取</p>
        <p>{{pageInfo.isSell && pageInfo.isSell === 2 ? '专属海报，邀请好友一起学习' : '专属海报及查询实时奖励'}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Actionsheet } from 'vux'
  import WechatMixin from '@/mixins/wechat'
  import ShareDialog from '@/components/shareDialog/ShareDialog'
  import ListMixin from '@/mixins/list'
  import wxUtil from '@/util/wx/index'

  import dynamic from '@/components/dynamic/dynamic'
  import memberContent from '@/components/memberContent/memberContent'
  import courseContent from '@/components/courseContent/courseContent'
  import CommunityCard from '@/components/communityCard_v2'
  import communityInfoCard from '@/components/communityInfoCard/communityInfoCard'
  import suspensionInput from '@/components/suspensionInput/suspensionInput'
  import Scroll from '@/components/scroller'

  import { getCommunityApi, getCommunicationsApi, setSubmitCommentApi, getRoleInfoApi, topPostListApi, delTopApi, addTopApi, getRecommendApi, deltePostApi, getLessMsgApi } from '@/api/pages/pageInfo'

  
	Component.registerHooks([
	  'beforeRouteEnter',
	  'beforeRouteLeave',
	  'beforeRouteUpdate' // for vue-router 2.2+
	])
	
  @Component({
    name: 'big-shot-community',
    components: {
      dynamic,
      memberContent,
      courseContent,
      CommunityCard,
      suspensionInput,
      Scroll,
      Actionsheet,
      communityInfoCard,
      ShareDialog
    },
    
    computed: {
      isAuthor () {
        return this.pageInfo.isAuthor
      },
      //判断身份是否嘉宾
      isKayo(){
      	return this.roleInfo.code
      }
    },
    watch: {
      displaySuspensionInput (val) {
        this.isShow = val
      }
    },
    mixins: [ListMixin, WechatMixin]
  })
  export default class community extends Vue {
    showShare = false // 显示分享弹框
    showSell = false // 显示分销弹框
    pageInfo = {}
    isShow = false // 控制评论框
    dynamicList = []
    discussItemList = []
    showType = 1 // 1 朋友圈 0 交流社区
    isCommunityTitleFixed = false
    showIdentification = true
    communityTitleTop = 0
    disableOperationArr = ['comment']
    starTime=''
    communityId=''
    roleInfo=''
    code=''
    type = 1
    saveAudio={}
    nowItem = {}
    lessSort = true   //课程排序
    userSort = 1   //学员排序
    lessSort = 'asc'   //课程排序
    relevantList = [] //相关推荐
    //显示标题模式
    titleBoxShow=false;

    commentIndex = -1
    suspensionInputPlaceholder = '来分享你的想法吧～'
    displaySuspensionInput = false
    courseList = []  //课节信息列表
    getCourseData = {
      upOrDown: '',
      sortNum: 0,
      isToStydy: false,
    }
    topList = []  //置顶列表
    //置顶item
    nowUserOpItem = {}
    lastStudy = {} //课节上次学到
    userOpActionsheet = {
      show: false,
      menus: [{
        label: '删除',
        value: '3'
      }]
    }
    // 有课程塔发布操作选项
    releaseActionsheet = {
      show: false,
      menus: [
        {
          label: '动态',
          value: 'default'
        },
        {
          label: '语音',
          value: 'voice'
        }
      ]
    }
    //无课程发布操作选项
    releaseActionsheet_no = {
      show: false,
      menus: [
        {
          label: '动态',
          value: 'default'
        }
      ]
    }
    
    qrSrc = ''
    
    //路由刚进入的时候
    beforeRouteEnter(to,from,next){
    	
				let nowCommunity=sessionStorage.getItem("nowCommunity");
			if(!nowCommunity){
				sessionStorage.setItem("nowCommunity",to.params.communityId)
				console.log(to,"我是没有记录community的时候")
				sessionStorage.setItem("isNewLoad",false)
			}else{
				if(nowCommunity===to.params.communityId){
					to.meta.keepAlive = true;
					console.log(to,"community相同时候打印我")
				}else{
					sessionStorage.setItem('scrollTop',0);
					sessionStorage.setItem("nowCommunity",to.params.communityId)
					console.log(to,"我是当前页面的路由信息")
					// sessionStorage.setItem("isNewLoad",true)
					to.meta.keepAlive = false;
				}
			}
			
			next();
   }
		
		//页面离开前
		beforeRouteLeave(to, from, next) {
		  if((this.nowItem.answer && this.nowItem.answer[0].type===2) || this.nowItem.circleType===1){
        this.saveAudio.pause();
        if(this.nowItem.modelType && this.nowItem.modelType==="problem"){
          this.nowItem.answers[0].musicState=0;
        }else{
          this.nowItem.musicState=0;
        }
      }
		 	next();
		 }
	
    created () {
    	let titleBoxShow=true;
    	console.log("5555555555555555",this.$route.query);
      if (this.$route.query.type !== undefined) {
        this.showType = this.$route.query.type
      }
      console.log('this.showType', this.showType)
      wxUtil.reloadPage()
      console.log(typeof this.$route.query.showShare)
      const showShare = this.$route.query.showShare
      if (showShare && (showShare.toString() === 'true')) {
        this.showShare = true
      }
			
      
    	this.pageInit().then(() => {
        const {
          title,
          simpleIntro,
          master,
          shareImg, // 分享图片
          sharePoint, // 分享摘要
          shareIntroduction,  // 分享标题
          communityId,
          startTime
        } = this.pageInfo
        const {realName, career} = master
        this.communityId=communityId
        this.starTime=startTime
        const str = realName ? realName + (career ? '|' + career : '') : ''
        // 页面分享信息
        this.wechatShare({
          'titles': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'title': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
          'desc': sharePoint || simpleIntro,
          'imgUrl': shareImg,
          'link': location.origin + `/beaconweb/#/introduce/${communityId}`
        })
        
        //判断嘉宾身份
        this.getRoleInfo(communityId).then(res=>{
        	this.roleInfo=res.role;
        }).catch(res => {
        		this.roleInfo=res.data.role;
				})
        console.log(this.pageInfo,"999999999999999999999999")
        
        //判断是否有课程，无课程则跳转
        if(this.pageInfo.isCourse!==3){
        	this.type=0;
        	let type=0;
        	this.displaySuspensionInput = false
	        this.dynamicList = []

	        this.showType = type
	        this.$router.replace(`/introduce/${this.$route.params.communityId}/community?type=${type}`)
	        this.showIdentification = !type
	
	        this.pagination.end = false // 初始化数据，必定不是最后一页
	        this.getList({page: 1})
        }
     })
      
      
    }
   
   	activated(){
   		const scrollDom=document.getElementsByClassName('scroll-container')[0];
    	scrollDom.scrollTop=sessionStorage.getItem("scrollTop");
    	if(JSON.parse(sessionStorage.getItem("isNewLoad"))){
    		sessionStorage.setItem("isNewLoad",false)
    		//重试请求数据
    			this.pageInit().then(() => {
		        const {
		          title,
		          simpleIntro,
		          master,
		          shareImg, // 分享图片
		          sharePoint, // 分享摘要
		          shareIntroduction,  // 分享标题
		          communityId,
		          startTime
		        } = this.pageInfo
		        const {realName, career} = master
		        this.communityId=communityId
		        this.starTime=startTime
		        const str = realName ? realName + (career ? '|' + career : '') : ''
		        // 页面分享信息
		        this.wechatShare({
		          'titles': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
		          'title': shareIntroduction || `我正在关注${realName}老师的灯塔【${title}】快来一起加入吧`,
		          'desc': sharePoint || simpleIntro,
		          'imgUrl': shareImg,
		          'link': location.origin + `/beaconweb/#/introduce/${communityId}`
		        })
		        
		        //判断嘉宾身份
		        this.getRoleInfo(communityId).then(res=>{
		        	this.roleInfo=res.role;
		        }).catch(res => {
		        		this.roleInfo=res.data.role;
						})
		        
		        //判断是否有课程，无课程则跳转
		        if(this.pageInfo.isCourse !==3 ){
		        	this.type=0;
		        	let type=0;
		        	this.displaySuspensionInput = false
			        this.dynamicList = []
		
			        this.showType = type
		//	        debugger
			        this.$router.replace(`/introduce/${this.$route.params.communityId}/community?type=${type}`)
		//	        debugger
			        this.showIdentification = !type
			
			        this.pagination.end = false // 初始化数据，必定不是最后一页
			        this.getList({page: 1})
		        }
		     })
    	}
   	}
   	
    mounted(){
    	console.log("修改成功了")
    }

    //控制音频
    controlAudio(e){
      this.saveAudio=e.nowaudio;
      this.nowItem=e.nowItem;
      console.log(e,"我是传递过来的对象")
    }
    
    //路由跳转more
    toMore(){
    	
    	console.log(this.communityId);
    	let that=this;
    	this.$router.push({path:'/introduce/:communityId/more',query:{communityId:this.communityId,classmateNum:this.pageInfo.joinedNum}})
    }
    
    closeShare () {
      this.showShare = false
      this.$router.replace({path: `/introduce/${this.pageInfo.communityId}/community`, query: {...this.$route.query, showShare: false}})
    }

    async pageInit () {
      const { communityId } = this.$route.params
      switch (communityId) {
        case '64074da38681f864082708b9be959e08':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
          //新增
      	case 'aa3b415b564bd95b27da2f0e9c986e6a':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
        case '25c2ff088da3f757b685a318ab050b5a':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
      	case '8fd72f707af6071a2a7d7bc6693a8ace':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
        case '67917ba04abd74c3247245576b1168b0':
          this.qrSrc = require('@/assets/page/qr_gzh_2.png')
          break
          //新增
        default:
          this.qrSrc = require('@/assets/page/qr_gzh_1.png')
          break
      }
      this.pagination.end = false // 初始化数据，必定不是最后一页
      let res = await this.getCommunity(communityId)

      console.log('=========',res)
      //嘉宾身份
      if(res.isAuthor == 0){
          let res2 = await this.getRoleInfo(communityId)
          if(res2.role && (res2.role.code =='guests'||res2.role.code =='special_guests')){
            res.isAuthor = 1;
          }
      }
      this.pageInfo = res
      await this.getList({page: 1})
      this.$nextTick(() => {
      	if(this.$refs['community-title']){
      		this.communityTitleTop = this.$refs['community-title'].offsetTop
      	}
      })

      this.getRecommendList(communityId)
      this.getTopList(communityId)
    }

    toggle (type) {
    	this.type = type
      if (this.showType !== type) {
        this.displaySuspensionInput = false
        this.dynamicList = []
        this.showType = type
        this.showIdentification = !type
				this.pagination.busy = false
        this.pagination.end = false // 初始化数据，必定不是最后一页
        this.getList({page: 1})
      }
    }

    setStick(){
    }

    question () {
      // :todo 回答问题
      this.$router.push(`/introduce/questions/${this.$route.params.communityId}`)
    }
    release () {
      // :todo 发布
      this.releaseActionsheet.show = true
    }
    postQuestions(){
    	// :todo 提问
        this.$router.push(`/introduce/ask/${this.$route.params.communityId}`)
    }
    posted(){
    	let code=this.roleInfo.code
    	console.log(code)
    	// :todo 发帖
        this.$router.push(`/publish/${this.$route.params.communityId}?type=0&code=${code}&codeType=${this.type}`)
    }
    toMemberList () {
      this.$router.push({name: 'classmates', communityId: this.$route.params.communityId})
    }
    suspensionInputState (val) {
      this.displaySuspensionInput = val
    }

    toHome () {
      this.$router.replace(`/index`)
    }

    /**
     * 操作事件
     * @param e :{eventType, itemIndex} eventType: 事件名称 itemIndex: 触发对象下标
     */
    operation (e) {
      const {eventType, itemIndex} = e

      const item = this.dynamicList[itemIndex]

      switch (eventType) {
        case 'comment':
          this.comment({item, itemIndex}).then()
          break
      }
    }

    /**
     * 评论
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async comment ({item, itemIndex}) {
      
      
      if (item.modelType !== 'circle') {
        this.suspensionInputPlaceholder = '回复' + item.releaseUser.realName + ':'
      }
      this.displaySuspensionInput = true
      this.commentIndex = itemIndex
      this.$refs.input.$refs['suspension-input'].focus()
    }

    /**
     * 发送评论
     * @param data
     */
    async sendComment ({value, commentIndex}) {
      const item = this.dynamicList[commentIndex]
      const {problemId, circleId} = item
      let sourceType = 4
      switch (item.modelType) {
        case 'circle':
          sourceType = 1
          break
        case 'post':
          sourceType = 2
          break
        case 'problem':
          sourceType = 3
          break
      }

      const params = {
        sourceId: circleId || problemId,     // 对应评论类型id
        sourceType,   // 评论类型：1.朋友圈；2.帖子；3.提问;4.子评论
        content: value       // 评论内容
      }

      const res = await setSubmitCommentApi(params)
      if (res) {
        this.$vux.toast.text('评论成功', 'bottom')
      } else {
        this.$vux.toast.text('评论失败', 'bottom')
      }
      // 普通评论不显示评论数据 
      if (this.dynamicList[commentIndex] && this.dynamicList[commentIndex].commentTotal > 0) {
        this.dynamicList[commentIndex].commentTotal += 1
      } else {
        this.dynamicList[commentIndex].commentTotal = 1
      }
    }

    // ------------------------------------------------
    /**
     * 获取社区基本信息
     **/
    getCommunity (communityId) {
      return getCommunityApi({
        communityId
      })
    }


    /**
     * 用户社区角色信息
     **/
    getRoleInfo (communityId) {
      return getRoleInfoApi({
        communityId
      })
    }

    /**
     * 获取交流社区列表
     **/
    getCommunicationsList (params) {
      return getCommunicationsApi(params)
    }
    // ------------------------------------------------

    async getList ({page, pageSize} = {}) {
      if (this.pagination.busy) {
        // 防止多次加载
        return
      }
      if (this.pagination.end) {
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize

      let params = {}
      if(this.showType){
        params = {
          id: this.$route.params.communityId,
          page : page,
          pageCount: pageSize,
          sort: this.lessSort,
          sortNum: this.getCourseData.sortNum,
        }

        if(this.getCourseData.isToStydy){
          params.sortNum = this.lastStudy.sort
          //delete params.sort
        }

        if(this.getCourseData.upOrDown){
          params.upOrDown = this.getCourseData.upOrDown
        }
      }else {
        params = {
          communityId: this.$route.params.communityId,
          page: page,
          pageCount: pageSize,
          sort: this.userSort,
        }
      }
      this.pagination.busy = true
      let res = ''
      if (this.showType) {
        res = await this.getLessMsgList(params)
        this.lastStudy = res.lastStudentCourse 
        this.getCourseData.sortNum = 0
        this.getCourseData.isToStydy = false
      } else {
        res = await this.getCommunicationsList(params)
      }
      const {courses, lists, total} = res

      const temp = new Array(...(this.showType ? courses : lists))
      temp.forEach((item) => {
        if (item['modelType'] === 'problem') {
          item['answers'].forEach((answer) => {
            answer.musicState = 0
            answer.progress = 0
          })
        } else if (item['circleType'] === 1) {
          item.musicState = 0
          item.progress = 0
        } else if (item['circleType'] === 2) {
          console.log('视频')
          item.videoPlay = false
        }
      })

      console.log(temp)
      if (page === 1) {
        this.dynamicList = temp
      } else {
        this.dynamicList = this.dynamicList.concat(temp || [])
      }

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = total
      this.pagination.end = this.isLastPage
      this.pagination.busy = false

      console.log('-------',this.pagination.end)
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
      this.pageInit()
      loaded('done')
    }

    /**
     * 上拉加载
     */
    async handlePullup (loaded) {
      if(this.showType === 1){
        loaded('ended')
        return
      }

      await this.loadNext()
      if (this.pagination.end) {
        loaded('ended')
      } else {
        loaded('done')
      }
    }

    /**
     * 点击发布选项item
     * @param {*} key
     * @param {*} item
     */
    handleReleaseActionsheetItem (key, item) {
      switch (key) {
        case 'default':
          this.$router.push(`/publish/${this.pageInfo.communityId}?code=${this.roleInfo.code}&codeType=${this.type}`)
          break
        case 'voice':
          this.$router.push(`/publishVoice/${this.pageInfo.communityId}`)
          break
        default:
          break
      }
    }
    
    /**
     * 点击置顶选项item
     * @param {*} key
     * @param {*} item
     */
    handleUserOpActionsheetItem (key, item) {
      switch (key) {
        case '1':
          this.topOp()
          break
        case '2':
          this.topOp()
          break
        case '3':
          this.delMsg()
          break
        default:
          break
      }
    }

    /**
     * 帖子置顶 or op
     */
    topOp(){
      console.log(this.nowUserOpItem)
      let data = {
        communityId: this.communityId,
        postId: this.nowUserOpItem.circleId
      }
      let that = this
      let nowItem = this.nowUserOpItem
      let topPostStatus = nowItem.topPostStatus

      if(topPostStatus == 0){
        addTopApi(data).then(res=>{
          that.opTopList(1,nowItem)
          that.dynamicList[nowItem.itemIndex].topPostStatus = !that.dynamicList[nowItem.itemIndex].topPostStatus
          that.nowUserOpItem = {}
        },res=>{
          this.$vux.toast.text('失败', res.message)
        })
      }else {
        delTopApi(data).then(res=>{
          that.opTopList(2,nowItem)
          that.dynamicList[nowItem.itemIndex].topPostStatus = !that.dynamicList[nowItem.itemIndex].topPostStatus

          that.nowUserOpItem = {}
        },res=>{
          this.$vux.toast.text('失败', res.message)
        })
      }
    }

    /**
     * 点击卡片
     */
    handleTapCard (item) {
        console.log(item)
        let url = ''
        if(item && item.isCourse == 3){
          url = `/introduce2/${item.communityId}/community`
        }else {
          url = `/introduce/${item.communityId}/community`
        }
        this.$router.push(url)
    }

    delMsg(){
      console.log(this.nowUserOpItem)
      if(this.nowUserOpItem.modelType === 'post'){
        let that = this
        let data = {
          id: this.nowUserOpItem.circleId,
          modelType : 'post'
        }
        deltePostApi(data).then(res=>{

        },res=>{
          this.$vux.toast.text('删除失败', res.message )
        })
      }
      //。删除帖子todo
    }

    opMember(e){
      console.log('=-=-=',e)
      this.userOpActionsheet.show = true
      this.userOpActionsheet.menus = e.menus
      this.nowUserOpItem = e.item
    }

    /**
     * 获取相关推荐
     */
    getRecommendList(communityId){
      let data = {
        communityId: communityId,
      }
      getRecommendApi(data).then(res=>{
        this.relevantList = res
      })
    }

    /**
     * 获取相关推荐
     */
    getLessMsgList (data){
      return getLessMsgApi(data)
    }

    // 课程 列表分页操作
    getLessPage (type) {
      console.log('=-=-=-==',type)
      this.getCourseData.upOrDown = type==1?'ip':'down'

      console.log(this.getCourseData.upOrDown)
      const nextPage = this.pagination.page + 1
      this.getList({ page: nextPage })
    }

    lessSetSort (){
      this.lessSort = this.lessSort == 'asc' ? 'desc' : 'asc'
      this.pagination.end = false
      this.pagination.busy = false
      this.getList({page: 1})
    }

    setSort(){
      this.userSort = this.userSort == 1? 2 : 1
      this.pagination.end = false
      this.pagination.busy = false
      this.getList({page: 1})
    }

    //置顶列表
    getTopList(communityId){
      if(communityId){
        topPostListApi({communityId: communityId}).then((res)=>{
          if(res.length>0){
            let tit = ''
            for(let i = 0;res.length>i;i++){
              tit = ''
              switch (res[i].circleType) {
                case 1:
                  tit = '【音频】'
                  break
                case 2:
                  tit = '【视频】'
                  break
                case 3:
                  tit = '【图片】'
                  break
                case 4:
                  tit = '【文件】'
                  break
              }
              res[i].tit = tit
            }
          }
          this.topList = res
        })
      }
    }
    //1增加 2删除
    opTopList(type,item){
      if( type && item){
        if(type == 1){  
          let circleType = item.circleType
          let tit = ''

          switch (circleType) {
            case 1:
              tit = '【音频】'
              break
            case 2:
              tit = '【视频】'
              break
            case 3:
              tit = '【图片】'
              break
            case 4:
              tit = '【文件】'
              break
          }
          item.tit = tit
          this.topList.push(item)
        }else if(type === 2){
          for(let i = 0;this.topList.length>i;i++){
            if(this.topList[i].circleId == item.circleId){
              this.topList.splice(i,1)
              return
            }
          }
        }
      }
    }

    toDetails (index) { // 去朋友圈、帖子、问题详情
      console.log(this.disableContentClick)
      if (this.disableContentClick) {
        return
      }
      let item = this.topList[index]
      let {circleType, circleId} = item
      if (circleType) {
        // 跳转详情页 sourceId type
        console.log('跳转详情页: ', circleId, circleType)
        this.$router.push(`/details/${circleId}/2`)
      }
    }

    toLastStudy (){
      this.getCourseData.isToStydy = true
      this.pageInit()
      loaded('done')
      this.getList({page: 1})
    }

    scroll (e) {
      if (this.displaySuspensionInput) {
        this.displaySuspensionInput = false
      }
      const communityTitleTop = this.communityTitleTop
      const {scrollTop} = e.target
      sessionStorage.setItem('scrollTop',scrollTop);
      if (communityTitleTop) {
        this.isCommunityTitleFixed = scrollTop >= communityTitleTop
      }
    }
  }
</script>
<style lang="less" scoped type="text/less">
  @import "../../styles/variables";
  @import "../../styles/mixins";
    & .module {
      border-top: 10px solid rgba(248,248,248,1);
      .module-title {
        margin: 0 15px;
        font-size: 18px;
        color: #929292;
        font-weight: 600;
        & p {
          display: block;
          font-size:18px;
          padding: 30px 0 15px 20px;
          line-height:22px;
          position:relative;
          
          &::before{
            content:'';
            display:block;
            position:absolute;
            top:32px;
            left:5px;
            width:5px;
            height:17px;
            background-color:#ffe266;
          }
        }
      }
      .module-content {
        .community-item {
          margin-top: 25px;
        }
      }

      & .hr {
        height: 1px; /* no */
        background: #dcdcdc;
      }

      & .desc {
        color: #bcbcbc;
        font-size: 13px;
        padding: 20px 0;
        text-align: center;
      }
    }

  .recommend_list {
    padding-left: 20px;
    .rem_blo {
      height: 50px;
      border-bottom: 1px solid #cccccc;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .blo_icon {
        height: 20px;
        width: 20px;
        background:rgba(255,226,102,1);
        border-radius: 50%;
        margin-right: 8px;

      }
      .blo_tit {
        flex: 1;
        font-size: 16px;
        font-family: PingFangSC-Light;
        color: rgba(53,64,72,1);
        line-height: 20px;
      }
      .blo_icon_to {
        height: 15px;
        width: 15px;
        margin-left: 2px;
        margin-right: 20px;
      }
    }
  }
  .course_top {
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFangSC-Light;
    align-items: center;
    margin: 0 15px 0px 20px;
    .top_left {
      color: rgba(146,146,146,1);
      line-height: 40px;
      .le_sp {
        color: #D7AB70;
      }
    }
    .top_right {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: #D7AB70;
      .right_icon {
        background: rgba(255,255,255,0.01);
        margin-right: 3px;
        width: 15px;
        height: 15px;
      }
    }
  }

  .big-shot-community {
    box-sizing: border-box;
    height: 100%;
    &.author {
      padding-bottom: 50px;
    }

    & .header {
      position: relative;

      & button {
        padding-right: 0;

      }

      & .share-btn, & .share-btn-2, & .share-btn-3 {
        position: absolute;
        top: 15px;
        right: 0;
        width: 70px;
        height: 32px;
        border-radius: 50px 0 0 50px;
        background-color: rgba(255, 255, 255, .8);
        font-size: 15px;
        line-height: 32px;
        color: #d7ab70;
        display: flex;
        align-items: center;
        justify-content: center;

        & .share-icon {
          width: 15px;
          height: 15px;
          margin-right: 5px;
          margin-left: 10px;
        }

        &::after {
          content: none;
        }
      }

      & .share-btn-2 {
        position: fixed;
        padding-left: 10px;
        min-width: 85px;
        background-color: #ffe266;
        font-size: 13px;
        color: #354048;
        z-index: 99;
      }

      & .share-btn-3 {
        position: fixed;
        padding-left: 13px;
        padding-right: 7px;
        background-color: #ffe266;
        width: inherit;
        font-size: 13px;
        color: #354048;
        z-index: 99;
      }

      .share-group {
        position: absolute;
        right: 10px;
        top: 25px;
        line-height: 1;
        font-size: 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
        z-index: 99;
        border-radius: 16px;
        .group_wrap {
          overflow: hidden;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          background: #fff;
        }
        .money_other {
          width: 60px;
          height: 23px;
          position: absolute;
          right: 0;
          top: -20px;
          border-raidus: 40px;
          font-size:12px;
          font-family:PingFangSC-Regular;
          color:rgba(53,64,72,1);
          line-height:18px;
          text-align: center;
          z-index: 100;

          img {
            width: 60px;
            height: 23px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: -1;
          }
        }
        &.fixed {
          position: fixed;
        }

        .u-btn {
          position: relative;
          line-height: 18px;
          font-size: 13px;
          color: @font-color-default;

          &:first-child {
            padding: 8px 12px 6px 15px;
          }

          &:last-child {
            padding: 8px 15px 6px 12px;
          }

          &.home,
          &.share {
            background: #fff;

            &:active {
              background: #f1f1f1;
            }
          }
          &.type_2 {
            padding: 8px 10px 6px 12px;
          }
          &.type_3 {
            padding: 6px 11px 6px 10px;
          }
          &.share:after {
            content: " ";
            display: block;
            position: absolute;
            right: 100%;
            top: 8px;
            background: #d8d8d8;
            width: 1px; /* no */
            height: 18px;
          }

          &.invite,
          &.money {
            background: #ffe266;
            
          }
        }
      }

      .community-item {
        .cover-container .master .career {
          padding-right: 50px;
        }

        .addon-text {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 19px;
          /*bottom: 10px;*/
          width: 20px;
          height: 20px;
          border-radius: 50%;
          /*padding: 0 10px;*/
          /*background: none;*/
          line-height: 28px;
          font-size: 13px;
          /*color: rgba(255, 255, 255, .8);*/
         	color:#000;
         	background: #FFE266;

          &:active {
            background: none;
            color: #fff;
          }

          .icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translateX(-50%);
            width: 100%;
            height: 100%;
            border-radius: 50%;
            /*background: #354048;*/
            vertical-align: middle;
          }
        }
      }
    }

    & .big-shot-community-title {
      padding: 0 15px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #929292;
      background-image: linear-gradient(-180deg, #FCFCFC 0%, #F8F8F8 100%);
      .item {
        display: block;
        flex: 1 1 auto;
        text-align: center;
        font-size: 16px;
        //font-family: PingFangSC-Medium;
        font-weight: 300;
        &:active {
          font-weight: 700;
          background: #f1f1f1;
        }
      }

      & span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #354048;
      }
      &.circles .item:first-of-type span,
      &.forum .item:last-of-type span {
        font-weight: 700;
        position: relative;
      }
      &.circles .item:first-of-type span:after,
      &.forum .item:last-of-type span:after {
        content: '';
        position: absolute;
        width: 15px;
        left: 50%;
        transform: translateX(-50%);
        right: 0;
        bottom: 0;
        height: 3px;
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
      }
    }

    & .container {
      font-size: 15px;

      & .classmate-list {
        margin: 20px 15px 0 15px;
        border-top: solid 1px #dcdcdc; /* no */
        border-bottom: solid 1px #dcdcdc; /* no */
        padding: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        height: 30px;
        color: #929292;
        font-size: 12px;

        & .people-count {
          display: flex;
          justify-content: space-between;
          align-items: center;

          & span {
            padding: 0 14px;
            font-size: 15px;
          }
          & .icon {
            width: 16px;
            height: 16px;
            border-style: none;
            border-radius: 0;
            margin-left: 0;
          }
        }

        & img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-left: -5px;
          border: solid 1px #ededed; /* no */
        }
        & img:first-of-type, & img:nth-of-type(14n + 1) {
          margin-left: 0;
        }
      }

      & .fixed-box {
        height: 40px;
        margin-top: 25px;
      }

      & .big-shot-community-content {

        & .blank {
          padding: 50px 0;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;

          font-size: 13px;
          color: #bcbcbc;

          & img {
            width: 130px;
            height: 130px;
          }
          & p {
          	text-align: center;
            margin-top: 20px;
          }
        }
      }
    }

    & .footer .ask-btn {
      position: fixed;
      right: 20px;
      bottom: 30px;
      width: 65px;
      height: 65px;
      background-color: #ffffff;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
      border-radius: 50%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      color: #d7ab70;

      & img {
        width: 26px;
        height: 25px;
        margin-top: 4px;
      }
    }

    & .footer .author-operation {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      width: 100%;

      & button {
      	width: 50%;
        flex-grow: 1;
        background-color: #ffffff;
        border-radius: 0;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        border-style: none;
        //font-family: PingFangSC-Regular;
        color: #354048;
        & .desc {
          position: relative;
          color:#354048
        }
        & .answer-count {
          .setTag();
          min-width: 13px;
          height: 13px;
          line-height: 13px;
          padding: 0 2px;
          transform: translate(100%, -50%);
          position: absolute;
          right:  -2px;
          top: 3px;
          font-size: 11px;
          /*background-color: #ff4949;*/
          /*border-radius: 50%;*/
          /*line-height: 1;*/
          /*display: inline-block;*/
          font-style: normal;
          /*color: #FFF;*/
          /*padding: 2px 3px;*/


        }
      }
      & button:last-of-type {
        /*background-color: #ffe266;*/
        color: #354048;
      }
    }
    
    & .ask-warp, & .author-operation{
    	border-top: 1px solid #ededed;
    	position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;

      & button {
        flex-grow: 1;
        background-color: #ffffff;
        border-radius: 0;
        height: 50px;
        line-height: 50px;
        color: #666666;
        font-size: 16px;
        border-style: none;
        color: #354048;
        & .desc {
          position: relative;
        }
        & .answer-count {
          .setTag();
          min-width: 13px;
          height: 13px;
          line-height: 13px;
          padding: 0 3px;
          transform: translate(100%, -50%);
          position: absolute;
          right: -2px;
          top: 3px;
          font-size: 10px;
          /*background-color: #ff4949;*/
          /*border-radius: 50%;*/
          /*line-height: 1;*/
          /*display: inline-block;*/
          font-style: normal;
          /*color: #FFF;*/
          /*padding: 2px 3px;*/
        }
      }
      & button:first-child{
      	position: relative;
      	
      	&::after{
          	content: '';
          	height: 24px;
          	width: 1px;
          	/*border: 1px solid #DCDCDC;*/
          	background-color: #DCDCDC;
          	position: absolute;
          	right:0px;
          	top: 50%;
          	transform: translateY(-50%);
          }
      }
      & button:last-of-type {
      	border-right: 1px solid #DCDCDC;
        /*background-color: #ffe266;*/
        color: #354048;
      }
    	
    	>.post-tip{
    		background-color: #FFFFFF;
    	}
    	
    	& img{
    		padding-right: 12px;
    		width: 20px;
    		height: 20px;
    	}
    }

    & .home-mask {
      & .sell-container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 285px;
        background: #fff;
        border-radius: 6px;
        transform: translate(-50%, -50%);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        padding: 45px 0;
        font-size: 15px;
        color: #666666;

        & .Qr {
          width: 160px;
          height: 160px;
          font-size: 0;
          margin-bottom: 12px;
        }
        & img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          text-align: center;
        }
      }
    }
  }

  .fixed2 {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin-top: 0;
    z-index: 99;
    background-image: linear-gradient(-180deg, #FCFCFC 0%, #F8F8F8 100%);
  }
</style>
