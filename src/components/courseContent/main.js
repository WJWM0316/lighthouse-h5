
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'
import localstorage from '@/util/localstorage/index'
import appGuide from '@/util/appGuide'

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
    },
    total: {
      type: Number,
      default: 0,
    },
    //是否塔主或者嘉宾
    isMaster: {
      type: Boolean,
      default: false,
    }
  },
  computed: {

  },
  watch: {
    sort () {},
    courseList () {},
    lastStudy () {},
    isIp(){},
    isDown(val){
      console.log(val)
      
    },
    total(){},
    isMaster(val){
      console.log(val)
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
  
  //计算时间差
  GetDateDiff(startDate,endDate)  {
    let dates = Math.floor((startDate - endDate))/(1000*60*60*24)
    return  dates
  }
  
  /* 是否展示app引导弹窗 */
  showAppguide (time, id, isTry) {
    let current_time = new Date().getTime();  //当前时间戳 
    let old_time = time
    //计算时间差
    let days = this.GetDateDiff(current_time ,old_time )
    let that = this
    if (days >= 5) {
      this.$vux.confirm.show({
        title: '课节学习',
        content: '打开App，学习更流程，还能体 验更完整的学习功能哟～',
        confirmText: '打开App',
        cancelText: '继续学习',
        // 组件除show外的属性
        onCancel () {
          that.$router.push({ path:`/Lesson?id=${id}&isTry=0&communityId=${that.communityId}` })
        },
        onConfirm () {
          that.toApp()
        }
      })
      this.$nextTick(() => {
        let confirm = window.document.getElementsByClassName('weui-dialog')[1].childNodes
        confirm[2].style.paddingBottom = '60px'
        confirm[4].firstChild.style.color = '#BCBCBC'
      })
      localstorage.set('oldTime', current_time)
    } else {
      this.$router.push({ path:`/Lesson?id=${id}&isTry=0&communityId=${that.communityId}` })
    }
  }
  
  toApp () {
    let path = `ttbeacon://app:8080/launcher%3Ft%3D2%26id%3D${this.communityId}`
    appGuide.isToApp(false, path)
  }

  // -------------------- 页面跳转 ------------------------
  //去课节
  toDetails (item) {
    console.log(item.statusInfo.isUnlock)
    let {id} = item
    let isTry = item.courseType == 2 ? 1: 0

    if(!this.isMaster && (item.statusInfo.isUnlock===0 && item.courseType !== 2) ){
      this.$vux.toast.text('这节课尚未解锁，快去完成上一节课的打卡任务解锁吧~', 'bottom')
      return
    }
    
    if (isTry === 1 ) {
      this.$router.push({ path:`/Lesson?id=${id}&isTry=${isTry}&communityId=${this.communityId}` })
    } else {
      /* 非试读课节 */
      let time = localstorage.get('oldTime')
      let that = this
      if (time) {
        this.showAppguide(time, id, isTry)
      } else {
        this.$vux.confirm.show({
          title: '课节学习',
          content: '打开App，学习更流程，还能体 验更完整的学习功能哟～',
          confirmText: '打开App',
          cancelText: '继续学习',
          onCancel () {
            that.$router.push({ path:`/Lesson?id=${id}&isTry=${isTry}&communityId=${that.communityId}` })
          },
          onConfirm () {
            that.toApp()
          }
        })
        this.$nextTick(() => {
          let confirm = window.document.getElementsByClassName('weui-dialog')[1].childNodes
          confirm[2].style.paddingBottom = '60px'
          confirm[4].firstChild.style.color = '#BCBCBC'
        })
        let current_time = new Date().getTime();  //当前时间戳 
        localstorage.set('oldTime', current_time)
      }
    }
  }
}
