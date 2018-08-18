<!--灯塔头部组件-->
<template>
  <a href="#" class="m-community" :class="cardClasses" @click.prevent.stop="handleTap">
  	<!--灯塔头部-->
    <div class="cover-container" :class="{'community3':community.isCourse === 2}">
      <image-item v-if='community.isCourse == 2' class="cover2" :src="community.detailImg" mode="full" />
      <div v-else class="cover"  />

      <span class="header-photo">
      	<img :src="community.icon"/>
      </span>

      <div  class="master" v-if=" community.isCourse === 2 ">
        <p class="name" :class="{ round: type === 1 }">
          <span class="text" v-text="community.master && community.masterIntro"></span>
        </p>
      </div>

      <slot name="cover-addon"></slot>
    </div>
    <!--灯塔头部 v-if="isEntentr" -->
    <div class="info" :class="{'community3':community.isCourse === 2}">
      <template v-if="community.isJoined === 1 && community.isCourse == 2">
        <h3 class="title2" v-text="community.title" ></h3>
      </template>

      <template v-else>
        <h3 class="title" v-text="community.title" ></h3>
        <p class="desc" v-text="community.masterIntro"></p>
      </template>

      <p class="timeMsg" v-if="community.isCourse == 2 && type==1">
        <span>开塔时间：</span>
        {{community.startTime * 1000 | date('YYYY年M月D日')}}-{{community.endTime * 1000 | date('YYYY年M月D日')}}</p>
      <div class="bottom" v-else>
        <div class="left" v-if="community&&community.menuPeople && community.menuPeople.number>0" @click.prevent.stop="toMore">
            <p class="residue">
              <span class="number">{{community.menuPeople.number}}</span> 
              人
            </p>
            <p class="residue">
              和你一起学
            </p>
        </div>

        <div class="center"  @click.prevent.stop="toMore" v-if="community.menuPeople&&community.menuPeople.outstandingStudents.length>0">
              <img class="user_icon" v-for="(item, index) in community.menuPeople.outstandingStudents" :src="item.avatar" v-if="index<3" />
              <img class="user_icon four" v-if="community.menuPeople.number>3 && community.menuPeople.outstandingStudents.length==3" src="../../assets/icon/firends-call-more.png"/>
        </div>
        <div class="right" >
          <template v-if="community.isJoined === 1 && isCommunityIntroduce">
            <p class="to_description" @click.prevent.stop="goTointroduceDetail">课程介绍
              <img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
            </p>
          </template>
          <template v-else>
            <!-- 已结束 -->
            <p v-if="isEnd">灯塔已结束</p>
            <!-- 未加入且已开社 -->
            <p v-else>灯塔已开启</p>
          </template>
        </div>
      </div>
    </div>
  </a>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'community-card',
  props: {
    // 大咖信息
    community: {
      type: Object,
      default () {
        return {
          master: {}
        }
      }
    },
    //是否是页介绍
    isCommunityIntroduce: {
      type: Boolean,
      default: false
    },

    // 类型：1为列表页卡片，2为详情页卡片
    type: {
      type: Number,
      default: 1
    },
    
    // 类型：true是未加入页，false是加入页
    isEntentr: {
      type: Boolean,
      default: true
    },

    //true 课程。 false 社区
    isCourse: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    'community.startTime': {
      handler (val) {
        if (this.community.isAuthor !== 1 && this.community.isJoined !== 1 && !this.isEnd) {
          // 启用倒计时
          this.countdown = this.getCountdown()
          this.countdown.start(this.community.startTime * 1000, (timestamp) => {
            if (timestamp > 0) {
              this.duration = timestamp
            } else {
              this.duration = 0
            }
          })
        }
      },
      deep: true,
      immediate: true
    },

    community(val){
      console.log("我是触发的community",val);
      this.community = val
    },
    isCommunityIntroduce(){

    }
  }
})
export default class CommunityCard extends Vue {
	created(){
    console.log("我是触发的community",this.isEntentr);
	}
  // 卡片类名集合
  cardClasses = {
    [`type-${this.type}`]: true,
    'z-joined': this.community.isAuthor === 1 || this.community.isJoined === 1,
    'z-full': this.community.remainingJoinNum <= 0,
    'z-unread': this.community.newMessage
  }

  duration = 0
  countdown = null

  // 是否已结束
  get isEnd () {
    return this.community.endTime * 1000 < new Date().getTime()
  }
  
  toMore(){
  	console.log(this.community)
    if(this.community.isJoined !== 1){
      return
    }
  	let that=this;
  	this.$router.push({path:'/introduce/:communityId/more',query:{communityId:this.community.communityId,classmateNum:this.community.joinedNum}})
  }

  /**
   * 点击卡片
   */
  handleTap (e) {
    // 列表页才触发点击
    this.$emit('tap-card', this.community)
  }

  /**
   * 获取倒计时对象
   * 先调用函数获取
   */
  getCountdown () {
    let t = null

    // 停止倒计时
    const stop = () => {
      if (t) {
        console.log('清除')
        clearInterval(t)
      }
    }

    // 启动倒计时
    const start = (endTimestamp, callback) => {
      callback = callback && typeof callback === 'function' ? callback : function (timestamp) {}
      stop(t) // 先停止存在的倒计时
      const now = new Date().getTime()
      const timestamp = endTimestamp - now >= 0 ? endTimestamp - now : 0
      callback(timestamp)
      if (timestamp > 0) {
        t = setInterval(() => {
          const cNow = new Date().getTime()
          const cTimestamp = endTimestamp - cNow >= 0 ? endTimestamp - cNow : 0
          callback(cTimestamp)
          if (cTimestamp <= 0) {
            stop(t)
          }
        }, 1000)
      }

      return t
    }

    return {
      start,
      stop
    }
  }

  goUs (userId) {
    this.$router.push({name: 'userInfo-details', params: {userId}})
  }

  goTointroduceDetail(){
    console.log(this.community)
    this.$router.push({name: 'introduce-detail', params: {communityId: this.community.communityId}})
  }

  /* ---- 父组件调用函数 ---- */
  /**
   * 停止计数器
   */
  stopCountdown () {
    if (this.countdown) {
      console.log('清除倒计时')
      this.countdown.stop()
    }
  }
}
</script>

<style lang="less" type="text/less" scoped="scoped">
@import "../../styles/variables";
@import "../../styles/mixins";


.m-community {
  display: block;
  &.type-2, &.type-1{
    .cover-container {
      /*头部改变新增属性*/
      position: relative;
    	height: 150px;
			.header-photo{
					display:block;
					width: 110px;
					height: 110px;
          box-shadow:0px 8px 38px 0px rgba(75,65,50,0.17);
          border-radius:3px;
					overflow:hidden;
					position: absolute;	
					top: 15px;
					left:50%;
					transform:translateX(-50%);
					margin-bottom:7.5px;
					img{
            border-radius:3px;
						width: 100%;
						height: 100%;
            box-sizing: border-box;
					}
			}
    }
    .info {
      padding: 0 20px;
    }
  }

  
  .cover2 {
    width: 100%;
    height: 101px;
    background:rgba(242,242,242,1);
  }
  


  &.z-unread {
    .cover-container {
      .master {
        .name {
          &::after {
            content: " ";
          }
        }
      }
    }
  }

  .cover-container {
    position: relative;
    /*margin-bottom: 10px;*/
    /*height: 226px;*/
    &.community3 {
      margin-bottom: 30px;
      .header-photo{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        top: 45px;
        >img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      } 
    }
    .cover {
      width: 100%;
     	height: 90px;
      background:rgba(242,242,242,1);
    }

    .master {
    	display: flex;
    	justify-content: center;
    	align-items: center;
	    width: 90%;
      margin: 0 auto;
	    text-align: center;
      box-sizing: border-box;
      padding-top: 32px;
      color: #666666;
      line-height: 16px;
      .name {
      	white-space: nowrap;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        line-height: 1;
        font-size: 0;
        font-weight: normal;
        max-width: 100%;
        padding-right:2px;
        .text {
          display: inline-block;
          line-height: 16px;
          font-size: 12px;
        }
        &.round {
          padding: 0 8px;
          background: #ffe266;
          border-radius: 11px;
          text-align: center;
          color: #354048;
          .text {
            line-height: 22px;
            font-size: 13px;
          }
        }

        &::after {
          content: none;
          display: block;
          box-sizing: border-box;
          position: absolute;
          right: -5px;
          top: -3px;
          background-color: #ff3434;
          width: 12px;
          height: 12px;
          border: solid 2px #fff;
          border-radius: 50%;
        }
      }

      .career {
      	display: inline-block;
      	white-space: nowrap;
        /*margin-bottom: -7px;*/
        line-height: 16px;
        font-size: 12px;
      }
    }
  }

  .info {
    &.community3 {
      margin-bottom: 30px;
      .title {
        text-align: left;
      }

      .desc {
        text-align: left;
      }
    }
    .timeMsg {
      font-size: 14px;
      font-family: PingFangSC-Light;
      color: rgba(146,146,146,1);
      line-height: 18px;
    }
    .title {
      display: block;
      line-height: 20px;
      font-weight: 600;
      font-size: 18px;
      color: #354048;
    }
    .title2{
      display: block;
      line-height: 20px;
      font-weight: 600;
      font-size: 18px;
      color: #354048;
      text-align: center;
      margin-top: -20px;
      margin-bottom: 20px;
    }
    .desc {
      font-weight: 300;
      display: block;
      margin-top: 6px;
      margin-bottom: 20px;
      line-height: 18px;
      font-size: 12px;
      color: #666666;
    }

    .bottom {
      display: flex;
      font-size: 12px;
      line-height: 18px;
      color: #929292;
      //font-family: PingFangSC-Light;
      font-weight: 300;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      margin-bottom: 2px;
      .left {
        flex: 0 0 auto;
        font-size: 11px;
        font-weight: 300;
        .residue {
          height: 15px;
          line-height: 15px;
          .number {
            font-weight: 400;

            font-size: 16px;
            color: #d7ab70;
          }
        }
      }
      .center {
        flex: 1 1 auto;
        margin: 0 15px;
        display: flex;
        flex-direction: row;
        .user_icon {
          width:30px;
          height:30px;
          border: 0.5px solid rgba(237,237,237,1);
          box-sizing: border-box;
          border-radius: 50%;
          overflow: hidden;
          display: block;
          margin-left: -6px;
          &:first-of-type {
            margin-left: 0;
          }
          &:end-of-type {
           border: none
          }
        }


      }
      .right {
        flex: 0 0 auto;
        align-
        justify-content: space-between;

        .countdown {
          margin-right: 5px;
          color: #d7ab70;
        }

        .time-range {
          color: #bcbcbc;
        }

        .to_description {
          display: flex;
          align-items: center;
          .to_img {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }
}
</style>
