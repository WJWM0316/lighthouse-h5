
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

  getPage(type){
    this.$emit('getLessPage',{
      type: type
    })
  }

  // -------------------- 页面跳转 ------------------------
  //去课节
  toDetails (item) { //
    console.log(item)
    const {id} = item
    /*if (isCanSee === 0) {
      this.$vux.toast.text('您未加入该灯塔，不能查看。', 'bottom')
      return
    }*/
    this.$router.push({path:`/Lesson?id=${id}`})
  }

}
