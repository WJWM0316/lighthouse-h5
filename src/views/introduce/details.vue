<template>
  <!-- 朋友圈、帖子、问题 详情 -->
  <div class="all-details" :class="{'pdBtom' : isShow}">
    <scroll @refresh="handleRefresh" @pullup="handlePullup">  
        <!-- header -->
        <div class="header">
          <dynamic :dynamicList="dynamicList"
                   :hideCommentBtn="true"
                   :hidePraiseBtn="false"
                   :hideBorder="true"
                   :hideCommentArea="true"
                   :isFold = "false"
                   :disableContentClick="true"
                   :showIdentification="false"
                   @getUserId="getUserId"
          ></dynamic>
        </div>
    
        <!-- container -->
        <div class="container">
          <!-- 评论 -->
          <div class="fixed-box" ref="ceiling-box">
            <div class="ceiling-box" :class="{navTabName}">
              <span @click="toggle('comment')">评论({{allTotal}})</span>
              <span @click="toggle('praise')">点赞({{item.favorTotal}})</span>
            </div>
          </div>
          <template v-if="navTabName === 'comment'">
            <div v-for="item,index in discussItemList">
              <!-- 热门评论 -->
              <div class="hot-area" v-if="hotCommentTotal > 0 && index === 0">
                <i class="hot-icon"><img src="../../assets/icon/icon_hotcomment@3x.png" alt=""></i>热门评论
              </div>
              <!-- 全部评论 -->
              <div class="hot-area" v-if="index === hotCommentTotal">
                <i class="hot-icon"><img src="../../assets/icon/tab-massage-1@3x.png" alt=""></i>全部评论
              </div>
              <discuss-item 
                          :item="item"
                          :key="index"
                          :itemIndex="index"
                          :showDelBtn="true"
                          @operation="operation"></discuss-item>
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
          <img v-else class="icon-zan" src="./../../assets/icon/zan2@3x.png" />
          {{item.favorTotal > 0 ? item.favorTotal : '点赞'}}
        </button>
        <span class="split"></span>
        <!-- 评论按钮 -->
        <button @click="comment({})">
          <img class="icon-pinglun" src="./../../assets/icon/pinglun2@3x.png" />
          {{pagination.total > 0 ? pagination.total : '评论'}}
        </button>
      </div>
    </div>

    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      :isShow = 'isShow'
                      @send="sendComment"
    ></suspension-input>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamic from '@/components/dynamic/dynamic'
  import discussItem from '@/components/discussItem/discussItem'
  import classmateItem from '@/components/classmateItem/classmateItem'
  import suspensionInput from '@/components/suspensionInput/suspensionInput'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { getCircleDetailApi, getPostDetailApi, getProblemDetailApi, getCommentListApi, setFavorApi, setSubmitCommentApi, delCommontApi, getFavorListApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'all-details',
    components: {
      dynamic,
      discussItem,
      classmateItem,
      Scroll,
      suspensionInput
    },
    computed: {
      item () {
        return this.dynamicList[0] || {}
      }
    },
    watch: {
      discussItemList () {
      },
      displaySuspensionInput (val) {
      }
    },
    mixins: [ListMixin]
  })
  export default class introduce extends Vue {
    dynamicList = []
    commentTotal = 0
    favorTotal = 0
    classmateList = []
    navTabName = 'comment'
    discussItemList = []
    hotCommentTotal = 0
    isShow = true
    allTotal = 0
    navTabName = 'comment'
    commentIndex = -1
    suspensionInputPlaceholder = '写评论'
    displaySuspensionInput = true
    curData = {} // 评论回来的数据
    modelType = '' // 评论类型
    classmateList = [] // 点赞列表

    created () {
      this.modelType = this.$route.params.type
      this.pageInit().then(() => {})
    }
    /**
     * 切换nav
     **/
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
        if (targetName === 'praise') {
          if (this.classmateList) {
            const params = {
              id: this.$route.params.sourceId,
              modelType: 'circle',
              page: 1,
              pageCount: 20
            }
            this.getFavorList(params).then(res => {
              const {list, total} = res
              this.classmateList = list
              this.favorTotal = total
              this.$router.replace({path: this.$route.path, query: {target: 'praise'}})
            })
          }
        } else {
          this.$router.replace({path: this.$route.path})
        }
      }
    }
    // ------------------- 评论区 ----------------------
    operation (e) {
      const {eventType, itemIndex, item, commentType} = e
      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          this.comment({item, itemIndex, commentType}).then()
          break
        case 'praise':
          this.praise({item, itemIndex, commentType}).then()
          break
        case 'del':
          this.del({item, itemIndex, commentType}).then()
          break
        case 'comment-area':
          this.jumpCommentDetail({item, commentType}).then()
      }
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
    jumpCommentDetail ({item, commentType}) {
      this.$router.push('/reply/' + item.commentId)
    }

    /**
     * 评论
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async comment ({item, itemIndex, commentType}) {
      if (itemIndex > -1) {
        this.suspensionInputPlaceholder = '回复' + item.reviewer.realName + ':'
        this.commentIndex = itemIndex
      } else {
        this.suspensionInputPlaceholder = '写评论'
        this.commentIndex = -1
      }
      this.displaySuspensionInput = true
    }

    getUserId ({res, favor}) {
      if (favor === 1) {
        this.classmateList.splice(0, 0, res)
      } else {
        this.classmateList.forEach((data, index) => {
          if (res.userId === data.userId) {
            console.log(111111111111, index)
            this.classmateList.splice(index, 1)
            console.log(this.classmateList)
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
    async praise ({item, itemIndex, commentType}) {
      let params = ''
      let favor = 0
      if (item) {
        const {commentId, favorId, isFavor} = item
        let favorType = 6
        favor = isFavor ? 0 : 1
        params = {
          favorId: commentId,    // 喜爱的id
          favorType,  // 喜爱类型：4问答；5帖子；6评论;7朋友圈；
          isFavor: favor     // 是否喜欢：0取消喜欢，1喜欢
        }
      } else {
        favor = this.dynamicList[0].isFavor ? 0 : 1
        let favorType = 0
        switch (this.$route.params.type) {
          case '1':
            favorType = 7
            break
          case '2':
            favorType = 5
            break
          case '3':
            favorType = 4
            break
        }
        params = {
          favorId: this.$route.params.sourceId,    // 喜爱的id
          favorType,  // 喜爱类型：4问答；5帖子；6评论;7朋友圈；
          isFavor: favor     // 是否喜欢：0取消喜欢，1喜欢
        }
      }
      console.log('favor', favor)
      const res = await setFavorApi(params)
      this.discussItemList[itemIndex].isFavor = favor
      this.discussItemList[itemIndex].favorTotal += favor ? 1 : -1
      console.log(this.discussItemList[itemIndex])
      
      if (favor) {
        this.discussItemList[itemIndex].favors = this.discussItemList[itemIndex].favors || []
        this.discussItemList[itemIndex].favors.splice(0, 0, res)
      } else {
        let tempIndex = ''
        this.discussItemList[itemIndex].favors.forEach((item, index) => {
          if (item.userId === res.userId) {
            tempIndex = index
          }
        })
        this.discussItemList[itemIndex].favors.splice(tempIndex, 1)
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
          this.$router.replace({path: this.$route.path, query: {target: 'praise'}})
          if (this.classmateList.length === 0) {
            this.getFavorList(params).then(res => {
              this.classmateList = res.list
              console.log(res)
            })
          }
        } else {
          this.isShow = true
        }
      }
    }


    /**
     * 发送评论
     * @param data
     */
    async sendComment ({value, commentIndex}) {
      const item = commentIndex > -1 ? this.discussItemList[commentIndex] : this.dynamicList[0]
      const {commentId, problemId, circleId} = item
      let sourceType = 4
      if (commentIndex < 0) {
        sourceType = this.modelType
      }

      const params = {
        sourceId: commentId || circleId || problemId,     // 对应评论类型id
        sourceType,   // 评论类型：1.朋友圈；2.帖子；3.提问;4.子评论
        content: value       // 评论内容
      }
      
      await setSubmitCommentApi(params).then(data => {
        this.curData = data
        this.$vux.toast.text('评论成功', 'bottom')
        this.suspensionInputPlaceholder = '写评论'
        this.suspensionInputPlaceholder = '写评论'
        let page = Math.ceil(commentIndex/20) // 向上取整 用于刷新当前page
        this.pagination.end = false // 初始化数据，必定不是最后一页
        this.getList({ page: page , type: 'comment'})
        this.commentIndex = -1
      }).catch(e => {
        this.$vux.toast.text('评论失败', 'bottom')
        this.curData = {}
      })
    } 
      



    async pageInit () {
      const { sourceId, type } = this.$route.params
      this.pagination.end = false // 初始化数据，必定不是最后一页
      let res = ''
      if (type === '1') {
        res = await this.getCircleDetailApi(sourceId)
      } else if (type === '2') {
        res = await this.getPostDetailApi(sourceId)
      } else {
        res = await this.getProblemDetailApi(sourceId)
      }

      if (res['modelType'] === 'problem') {
        res['answers'].forEach((answer) => {
          answer.musicState = 0
          answer.progress = 0
        })
      } else if (res['circleType'] === 1) {
        res.musicState = 0
        res.progress = 0
      } else if (res['circleType'] === 2) {
        res.videoPlay = false
      }
      this.dynamicList = [res]
      await this.getList({page: 1})
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
        const res = await this.getFavorList(params)
        const {list, total} = res
        allTotal = total
        if (page === 1) {
          this.classmateList = list
        } else {
          this.classmateList = this.classmateList.concat(list || [])
        }
      }
      this.hotCommentTotal = hotCommentTotal
      for (var i = 0; i<hotCommentTotal; i++) {
        this.discussItemList[i].isHot = true
      }
      console.log(this.discussItemList)
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
      this.loadNext().then(() => { loaded('done') })
    }
  }
</script>
<style lang="less" scoped>
  .all-details {
    box-sizing: border-box;
    height: 100%;
    &.pdBtom {
      padding-bottom: 50px;
    }
    & .header {
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
        font-weight: 500;
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
        width: 15px;
        height: 20px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    & .container {
      padding-top: 4px;
      & .container-title {
        font-size: 15px;
        font-weight: 500;
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
