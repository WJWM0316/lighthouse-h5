
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
    },
    isIp: {
      type: Boolean,
      default: false
    },
    isDown: {
      type: Boolean,
      default: false
    }
  },
  computed: {

  },
  watch: {
    sort (val) {
      this.sort = val
    },
    courseList (val) {
      this.courseList = val
    },
    lastStudy (val) {
      this.lastStudy = val
    },
    isIp(val){
      this.isIp = val
    },
    isDown(val){
      this.isDown = val

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
    console.log(item.statusInfo.isUnlock)
    let {id} = item
    let isTry = item.courseType == 2 ? 1: 0

    if(item.statusInfo.isUnlock===0 && item.courseType !== 2){
      this.$vux.toast.text('还没有解锁', 'bottom')
      return
    }
    /*if (isCanSee === 0) {
      this.$vux.toast.text('您未加入该灯塔，不能查看。', 'bottom')
      return
    }*/
    this.$router.push({ path:`/Lesson?id=${id}&isTry=${isTry}&communityId=${this.communityId}` })
  }



}
