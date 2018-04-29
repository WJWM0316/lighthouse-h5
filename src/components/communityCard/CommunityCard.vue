<!--灯塔头部组件-->
<template>
  <a href="#" class="m-community" :class="cardClasses" @click.prevent.stop="handleTap">
  	<!--灯塔头部-->
    <div class="cover-container">
      <image-item class="cover" :src="community.detailImg" mode="full" />
      <span class="header-photo">
      	<img :src="community.icon"/>
      </span>
      <div class="master">
        <p class="name" :class="{ round: type === 1 }">
          <span class="text" v-text="community.master && community.master.realName"></span>
        </p><span v-if="community.master && community.master.career">/</span><p class="career" v-text="community.master && community.master.career">asdfasdf</p>
      </div>
      <slot name="cover-addon"></slot>
    </div>
    <!--灯塔头部-->

    <div v-if="isEntentr" class="info" :class="{ 'type-2': type === 2 }">
      <h3 class="title" v-text="community.title"></h3>
      <p class="desc" v-text="community.simpleIntro"></p>
      <div class="bottom">
        <div class="left">
          <!-- 已结束 -->
          <p v-if="isEnd">灯塔已关闭</p>
          <!-- 已加入 -->
          <p class="time-range" v-else-if="community.isAuthor === 1 || community.isJoined === 1">开课时间：{{community.startTime * 1000 | date('YYYY年MM月DD日')}}-{{community.endTime * 1000 | date('YYYY年MM月DD日')}}</p>
          <!-- 未加入且未开社 -->
          <p class="countdown" v-else-if="duration">{{duration | duration}}后开启</p>
          <!-- 未加入且已开社 -->
          <p v-else>灯塔已开启</p>
        </div>
        <div class="right">
          <template v-if="community.isAuthor !== 1 && community.isJoined !== 1 && !isEnd">
            <p class="residue" v-if="community.remainingJoinNum <= 0">已满员</p>
            <p class="residue" v-else-if="community.freeJoinedNum || community.payJoinedNum"><span class="number">{{community.freeJoinedNum + community.payJoinedNum}}</span> 人已加入</p>
          </template>
        </div>
      </div>
    </div>
    
    <!--已加入灯塔标题-->
    <div v-else class="communit-enter-title">
    		<h3 class="title"><span v-text="community.title"></span><slot name="cover-addon-more"></slot></h3>
    		
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

    // 类型：1为列表页卡片，2为详情页卡片
    type: {
      type: Number,
      default: 1
    },
    
    // 类型：true是未加入页，false是加入页
    isEntentr: {
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
    }
  }
})
export default class CommunityCard extends Vue {
	created(){
    //console.log("我是触发的community",this.isEntentr);
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

<style lang="less" type="text/less">
@import "../../styles/variables";
@import "../../styles/mixins";

.m-community {
  display: block;

  &.type-1 {

    .cover-container {
			
      .cover {
        border-radius: 3px;
      }

      .master {
        border-radius: 0 0 3px 3px;

        .name {
          .text {
            .setEllipsis();
          }
        }

        .career {
          .setEllipsis();
          font-size: 11px;
        }
      }
    }

    .info {
      .title {
        .setEllipsis();
      }

      .desc {
        .setEllipsis();
      }
    }
  }

  &.type-2 {

    .cover-container {
      /*height: 171px;*/
      /*头部改变新增属性*/
      position: relative;
    	height: 174px;
			.header-photo{
					display:block;
					width:80px;
					height: 80px;
					border-radius: 50%;
					overflow:hidden;
					position: absolute;	
					top: 44px;
					left:50%;
					transform:translateX(-50%);
					margin-bottom:7.5px;
					
					>img{
						border-radius: 50%;
						width: 100%;
						height: 100%;
            box-sizing: border-box;
            border: 1px solid #ffffff;
					}
			}
			/*新增*/

      .master {
        padding-bottom: 10px;
      }
    }

    .info {
      padding: 0 20px;
    }
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

    .cover {
      width: 100%;
     	height: 100px;
    }

    .master {
	    width: 100%;
	    text-align: center;
      box-sizing: border-box;
      padding: 12px;
      padding-top: 32px;
      color: #666666;
      line-height: 16px;
      /*position: absolute;
      top: 130px;
      left: 50%;*/
      /*right: 0;*/
      /*bottom: 0;*/
     	/*transform: translateX(-50%);*/
      /*background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2));*/
      /*width: 100%;*/
      

      .name {
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
          
          /*font-size: 27px;*/
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
        margin-bottom: -7px;
        line-height: 16px;
        font-size: 12px;
      }
    }
  }
  
  .communit-enter-title{
  	text-align: center;
  	margin-top: -20px;
  	.title{
  		position: relative;
  		display: inline-block;
  		color: #354048;
  		font-size: 18px;
  		line-height: 22px;
  		text-align: center;
  		padding: 0 12%;
  		font-family: PingFangSC-Medium;
  	}
  }

  .info {

    .title {
      display: block;
      line-height: 22px;
      font-weight: 600;
      font-size: 18px;
      color: @font-color-default;
    }

    .desc {
      font-family: PingFangSC-Light;
      display: block;
      margin-top: 6px;
      margin-bottom: 23px;
      line-height: 18px;
      font-size: 14px;
      color: #666666;
    }

    .bottom {
      display: flex;
      font-size: 14px;
      line-height: 18px;
      color: #929292;
      font-family: PingFangSC-Light;
      .left {
        flex: 1 1 auto;

        .countdown {
          margin-right: 5px;
          color: #d7ab70;
        }

        .time-range {
          color: #bcbcbc;
        }
      }

      .right {
        flex: 0 0 auto;

        .residue {

          .number {
            color: #d7ab70;
          }
        }
      }
    }
  }
}
</style>
