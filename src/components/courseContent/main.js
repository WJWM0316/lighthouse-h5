
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'

@Component({
  name: 'course-content',
  props: {
    courseList: {
      type: Array,
      default: []
    },
    sort: {
      type: String,
      default: 'asc'
    },
  },
  computed: {

  },
  watch: {
    sort (val) {
      this.sort = val
    },
    courseList (val) {
      this.courseList = val
    }
  }
})
export default class dynamicItem extends Vue {
  video = ''
  created () {
    console.log('!!!!!!!',this.courseList)
  }
  
  lessSort(){
    this.$emit('lessSetSort')
  }

  /**
   * 删除
   */
  del () {
    const itemIndex = this.itemIndex
    this.$emit('operation', {
      eventType: 'del',
      itemIndex
    })
  }

  // -------------------- 页面跳转 ------------------------
  toUserInfo (userId) { // 去个人详情
    if (this.disableUserClick) {
      return
    }
    console.log('去个人详情: ', userId)
    this.$router.push(`/userInfo/${userId}/details`)
  }
  toDetails () { // 去朋友圈、帖子、问题详情
    if (this.disableContentClick) {
      return
    }
    const item = this.item
    const {modelType, circleId, problemId, isCanSee} = item
    if (isCanSee === 0) {
      this.$vux.toast.text('您未加入该灯塔，不能查看。', 'bottom')
      return
    }
    let type = 0
    switch (modelType) {
      case 'circle':
        type = 1
        break
      case 'post':
        type = 2
        break
      case 'problem':
        type = 3
        break
    }
    if (type) {
      // 跳转详情页 sourceId type
      const sourceId = circleId || problemId
      console.log('跳转详情页: ', sourceId, type)
      // this.$router.push({name: 'all-details', params: {sourceId, type}})
      this.$router.push(`/details/${sourceId}/${type}`)
    }
  }

}
