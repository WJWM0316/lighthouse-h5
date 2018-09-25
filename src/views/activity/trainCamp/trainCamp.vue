<template>
  <div class="p-body p-home-index camp" >

      <img class="camp_top" src="./../../../assets/activity/train/camp_top.png" />

      <!-- tips -->
      <div class="camp_tips">
        <img class="tips" src="./../../../assets/activity/train/camp_tips.png" />
      </div>

      <!-- 简介 -->
      <div class="camp_desc">
        <img class="desc_1" src="./../../../assets/activity/train/desc_1.png" />
        <img class="desc_2" src="./../../../assets/activity/train/desc_2.png" />
        
      </div>

      <!-- 内容 -->
      <div class="camp_cont">
        <img class="cont_1" src="./../../../assets/activity/train/cont_1.png" />
        <img class="cont_2" src="./../../../assets/activity/train/cont_2.png" />
        <img class="cont_3" src="./../../../assets/activity/train/cont_3.png" />
        <img class="cont_4" src="./../../../assets/activity/train/cont_4.png" />
      </div>

      <img class="buy_msg" src="./../../../assets/activity/train/buy.png" />


      <div class="btn_cont">
        <div class="btn_main">
          <a href="https://www.wjx.top/m/28346944.aspx"></a>
          <img class="btn" src="./../../../assets/activity/train/btn.png" />
          <p class="txt">我要报名</p>
          <p class="num" v-if="peopleNum>0">(已有{{peopleNum}}人报名)</p>
        </div>
      </div>

  </div>
</template>
<style lang="less" scoped>
  @import "../../../styles/variables";
  @import "../../../styles/mixins";
  @import "../../../styles/dprPx";
  .camp {
    background: #FFE107;
    height: 100vh;
    padding-bottom: 120px;
    padding-top: 24px;
    img {
      display: block;
      margin: 0 auto;
      width: 100%;
      height: auto;
    }

    .camp_top {
      width: 303px;
      height: 398px;
      margin-left: 50px;
    }
    .camp_tips {
      margin: 25px 0;
      .tips {
        width: 338px;
        height: 186px;
      }
    }
    .camp_desc {
      .desc_1 {}
      .desc_2 {}
    }
    .camp_cont {
      .cont_1 {}
      .cont_2 {}
      .cont_3 {}
      .cont_4 {}
    }

    .btn_cont {
      width: 100%;
      position: fixed;
      bottom: 0;
      height: 112px;
      z-index: 1000;
      left: 0;
      .btn_main {
        width: 264px;
        height: 67.5px;
        position: absolute;
        top: 25px;
        left: 50%;
        margin-left: -132px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        a {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        .txt {
          font-size: 17px;
          font-family:SourceHanSansCN-Bold;
          font-weight:bold;
          color:rgba(255,255,255,1);
          margin: -10px 0 0px 0;

        }
        .num {
          font-size: 14px;
          font-family:SourceHanSansCN-Light;
          font-weight:300;
          color:rgba(254,219,213,1);
          position: relative;
          bottom: 1px;
        }
      }
      .btn {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
    }
  }
</style>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import { Swiper, SwiperItem } from 'vux'
import explore from '@/components/explore/explore'
import Scroller from '@/components/scroller'
import ListMixin from '@/mixins/list'
import wxUtil from '@/util/wx/index'
import WechatMixin from '@/mixins/wechat'
import { planetYouth } from '@/api/pages/activity'

  @Component({
    name: 'home-index',
    components: {
      Scroller
    },
    mixins: [ListMixin,WechatMixin]
  })
  export default class HomeIndex extends Vue {
    communities = []
    // ******************* 已加入 **********************
    pickedParams = { // 页面所需参数
      tagId: 0
    }

    peopleNum = 1

    toIndex(){
      this.$router.push(`/index`)
    }

    created () {
      console.log('====',this.$route)
      let that = this
      if(this.$route.query){
        this.statistics = this.$route.query
      }

      planetYouth().then(res=>{
        console.log(res)
        this.peopleNum = res

        that.wechatShare({
          'titles': '月薪5万的人都在学的职场必修课',
          'title': '月薪5万的人都在学的职场必修课',
          'desc': '如何快速找准自己的职业发展道路？如何提高工作效率告别加班？这一堂，全给你！',
          'imgUrl': 'https://cdnstatic.zike.com/Uploads/static/beacon/lighthouse-logo.png',
          'link': location.origin + `/beaconweb/#/teacherActivity`
        })
      })
    }

    // ------------------------------------------------
    /**
     * 页面入口初始
     */

  }
</script>
