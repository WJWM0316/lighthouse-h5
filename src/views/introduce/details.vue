<template>

  <!-- 朋友圈、帖子、问题 详情 -->
  <div class="all-details">
    <scroll @refresh="handleRefresh" @pullup="handlePullup">
      <!-- header -->
      <div class="header">
        <dynamic :dynamicList="dynamicList"
                 :hideCommentBtn="true"
                 :hidePraiseBtn="true"
                 :hideBorder="true"
                 :hideCommentArea="true"
                 :disableContentClick="true"
                 :showIdentification="true"
                 ref="details-info"
        ></dynamic>
      </div>

      <!-- container -->
      <div class="container">
        <div class="container-title">评论({{pagination.total}})</div>
        <discuss-item v-for="item,index in discussItemList"
                      :item="item"
                      :key="index"
                      :itemIndex="index"
                      :showDelBtn="true"
                      @operation="operation"></discuss-item>
      </div>
    </scroll>
    <!-- footer -->
    <div class="footer">
      <div class="page-operation" v-if="!displaySuspensionInput">
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
                      @send="sendComment"
    ></suspension-input>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamic from '@/components/dynamic/dynamic'
  import discussItem from '@/components/discussItem/discussItem'
  import suspensionInput from '@/components/suspensionInput/suspensionInput'
  import Scroll from '@/components/scroller'
  import ListMixin from '@/mixins/list'
  import { getCircleDetailApi, getPostDetailApi, getProblemDetailApi, getCommentListApi, setFavorApi, setSubmitCommentApi, delCommontApi } from '@/api/pages/pageInfo.js'

  @Component({
    name: 'all-details',
    components: {
      dynamic,
      discussItem,
      Scroll,
      suspensionInput
    },
    computed: {
      item () {
        return this.dynamicList[0] || {}
      }
    },
    mixins: [ListMixin]
  })
  export default class introduce extends Vue {
    dynamicList = []
    discussItemList = []

    commentIndex = -1
    suspensionInputPlaceholder = '写评论'
    displaySuspensionInput = false

    created () {
      this.pageInit().then(() => {})
    }

    // ------------------- 评论区 ----------------------
    operation (e) {
      const {eventType, itemIndex} = e
      const item = this.discussItemList[itemIndex]
      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          this.comment({item, itemIndex}).then()
          break
        case 'praise':
          this.praise({item, itemIndex}).then()
          break
        case 'del':
          this.del({item, itemIndex}).then()
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
      if (itemIndex > -1) {
        this.suspensionInputPlaceholder = '回复' + item.realName + ':'
        this.commentIndex = itemIndex
      } else {
        this.suspensionInputPlaceholder = '写评论'
        this.commentIndex = -1
      }
      this.displaySuspensionInput = true
    }
    /**
     * 点赞
     * @param item
     * @param itemIndex
     * @returns {Promise.<void>}
     */
    async praise ({item, itemIndex}) {
      let params = ''
      let favor = 0
      if (item) {
        const {commentId: favorId, isFavor} = item
        let favorType = 6
        favor = isFavor ? 0 : 1
        params = {
          favorId,    // 喜爱的id
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
      setFavorApi(params).then(res => {
        console.log(item)
        if (item) {
          this.discussItemList[itemIndex].isFavor = favor
          this.discussItemList[itemIndex].favorTotal += favor ? 1 : -1
          if (favor) {
            this.discussItemList[itemIndex].favors.splice(0, 0, res)
          } else {
            let temp = ''
            this.discussItemList[itemIndex].favors.forEach((item, index) => {
              if (item.userId === res.userId) {
                temp = index
              }
            })
            this.discussItemList[itemIndex].favors.splice(temp, 1)
          }
        } else {
          this.dynamicList[0].isFavor = favor
          this.dynamicList[0].favorTotal += favor ? 1 : -1
          console.log(this.dynamicList[0])
        }
      }).catch(e => {
//            this.$broadcast('show-message', {content: e.message})
      })
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
            _this.discussItemList.splice(itemIndex, 1)
            _this.pagination.total -= 1
          }).catch(e => {
          })
        }
      })
      console.log(this.discussItemList, itemIndex)
    }
    // ------------------------------------------------

    /**
     * 发送评论
     * @param data
     */
    async sendComment ({value, commentIndex}) {
      const item = commentIndex > -1 ? this.discussItemList[commentIndex] : this.dynamicList[0]
      const {modelType, commentId, problemId, circleId} = item

      console.log(commentIndex)
      let sourceType = 4
      if (commentIndex < 0) {
        switch (modelType) {
          case 'post':
            sourceType = 2
            break
          case 'problem':
            sourceType = 3
            break
          default:
            sourceType = 1
            break
        }
      }

      const params = {
        sourceId: commentId || circleId || problemId,     // 对应评论类型id
        sourceType,   // 评论类型：1.朋友圈；2.帖子；3.提问;4.子评论
        content: value       // 评论内容
      }

      const res = await setSubmitCommentApi(params)

      if (commentIndex < 0) {
        this.pagination.end = false // 初始化数据，必定不是最后一页
        await this.getList({page: 1})
      } else {
        if (this.discussItemList[commentIndex] && this.discussItemList[commentIndex].comments) {
          this.discussItemList[commentIndex].comments.splice(0, 0, res) // 评价列表已经存在加在尾部
          this.discussItemList[commentIndex].commentTotal += 1
        } else {
          this.discussItemList[commentIndex]['comments'] = [res] // 不存在加一个对象
          this.discussItemList[commentIndex].commentTotal = 1
        }
      }
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
      const params = {
        sourceId: this.$route.params.sourceId,
        type: this.$route.params.type * 1,
        page: page,
        pageCount: pageSize
      }

      this.pagination.busy = true
      const res = await this.getCommentList(params)
      const {topComments, total} = res

      if (page === 1) {
        this.discussItemList = topComments
      } else {
        this.discussItemList = this.discussItemList.concat(topComments || [])
      }

      this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = total
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
    padding-bottom: 50px;
    height: 100%;
    & .header {
    }

    & .container {
      & .container-title {
        font-size: 15px;
        font-weight: 500;
        color: #354048;
        padding: 10px 0;
        margin: 0 15px;
        border-bottom: solid 1px #dcdcdc;
      }
    }

    .footer {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;

      & .page-operation {
        display: flex;
        align-items: center;
        border-top: solid 1px #ededed;
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
