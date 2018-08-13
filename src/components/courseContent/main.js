
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
    communityId: {
      type: String,
    },
    lastStudy: {
      type: Object,
    }
  },
  computed: {

  },
  watch: {
    sort (val) {
      this.sort = val
    },
    courseList (val) {
      console.log(1111,val)
      this.courseList = val
    },
    lastStudy (val) {
      console.log(1111,val)
      this.lastStudy = val
    },
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

  getPage(type){
    this.$emit('getLessPage',{
      type: type
    })
  }

  toLastStudy () {
    this.$emit('toLastStudy')
  }

  // -------------------- 页面跳转 ------------------------
  //去课节
  toDetails (item) { //
    console.log(item)
    let {id} = item
    let isTry = item.courseType == 2 ? 1: 0
    /*if (isCanSee === 0) {
      this.$vux.toast.text('您未加入该灯塔，不能查看。', 'bottom')
      return
    }*/
    this.$router.push({ path:`/Lesson?id=${id}&isTry=${isTry}&communityId=${this.communityId}` })
  }



}
