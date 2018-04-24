<template>	
  <!-- 发现 -->
  <div class="find-wrap">
    <scroller  @refresh="handleRefresh" @pullup="handlePullup" :is-none-data="pagination.end">
      <div>
        <explore :exploreList="finds"
                 :disableOperationArr="disableOperationArr"
                 @disableOperationEvents="disableOperationEvents"
        ></explore>
      </div>
    </scroller >
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import explore from '@/components/explore/explore'
import ListMixin from '@/mixins/list'
import Scroller from '@/components/scroller'
import {getSelectionApi} from '@/api/pages/home'
@Component({
  name: 'find-index',
  components: {
    explore,
    Scroller
  },
  mixins: [ListMixin]
})
export default class HomeIndex extends Vue {
// ******************** 发现 ***********************
 
  finds = []
	disableOperationArr = ['comment', 'praise']
  ready = false

	disableOperationEvents (e) {
    const {eventType} = e
    console.log(eventType, '拦截')
    this.$router.push(`/index/details/${this.finds[e.itemIndex].circleId}`)
  }
  /**
   * 发现
   **/
  getFindApi (params) {
    console.log(params)
    return getSelectionApi(params)
  }
  /**
   * 加载下一页
   */
  loadNext() {
    const nextPage = this.pagination.page + 1
    this.getList({ page: nextPage }).then(() => {})
  }
  // ------------------------------------------------

  created () {
    this.init().then(() => {})
  }
  /**
   * 页面入口初始
   */
  async init () {
    const navTabName = this.navTabName
    this.pagination.end = false
    this.pagination.busy = false
    await this.findInit()
    this.ready = true
  }
  /**
   * 发现 Tab 初始
   */
  async findInit () {
    this.pagination.end = false // 初始化数据，必定不是最后一页
    console.log('发现 Tab 初始')

    await this.getList({ page: 1 })
  }
  /**
   * 获取列表
   */
  async getList ({ page, pageSize } = {}) {
    try {
      if (this.pagination.end || this.pagination.busy) {
        // 防止多次加载
        return
      }
      page = page || this.pagination.page || 1
      pageSize = pageSize || this.pagination.pageSize
      const params = {
        page: page,
        pageCount: pageSize,
        globalLoading: !this.ready
      }

      this.pagination.busy = true
      let res = ''
      let allTotal = 0
  		res = await this.getFindApi(params)
      
	    if (res && res.list && res.list.length > 0) {
	      res.list.forEach((item) => {
	        if (item['modelType'] === 'problem') {
	          if (item['answers']) {
	            item['answers'].forEach((answer) => {
	              answer.musicState = 0
	              answer.progress = 0
	            })
	          }
	        } else if (item['circleType'] === 1) {
	          item.musicState = 0
	          item.progress = 0
	        } else if (item['circleType'] === 2) {
	          item.videoPlay = false
	        }
	      })
	      console.log('发现: ', res)
	      this.finds = res.list
	      allTotal = res.total
	    }
	    this.pagination.page = page
      this.pagination.pageSize = pageSize
      this.pagination.total = allTotal
      this.pagination.end = this.isLastPage
      this.pagination.busy = false

	  } catch (error) {
      console.log(error)
      this.$vux.toast.text(error.message, 'bottom')
    }
  }
  /**
   * 下拉刷新
   */
  handleRefresh (loaded) {
    setTimeout(() => {
      this.init()
      loaded('done')
    }, 500)
  }

  /**
   * 上拉加载
   */
  handlePullup (loaded) {
    setTimeout(() => {
      this.loadNext()
      loaded('done')
    }, 500)
  }
}
</script>
<style scoped>
  .find-wrap {
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 50px;
  }
</style>