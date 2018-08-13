<template>
  <!-- 朋友圈动态列表项 -->
  <div class="course_content"  v-if="courseList">
    <!-- 头部操作 -->
    <div class="course_top" v-if="courseList.length>0">
      <div class="top_left">已更新<span class="le_sp">{{courseList.length}}</span>篇</div>
      <div class="top_center" v-if="lastStudy && lastStudy.id">
        <img class='top_icon center_icon' src="./../../assets/icon/bnt_positioning@3x.png"/>
        上次学到
      </div>
      <div class="top_right" @click.prevent.stop="lessSort">
        <img class='top_icon right_icon' src="./../../assets/icon/bnt_order@3x.png"/>
        <span v-if="sort == 'asc'">倒序</span>
        <span v-else>正序</span>
      </div>
    </div>

    <div class="getPage" @click.prevent.stop="getPage(1)" v-if="courseList.length<10" >点击加载前面内容</div>
    <!-- 列表 -->
    <div class="attempt_list" v-if="courseList.length>0">
      <div class="attempt_block"  @click.stop="toDetails(item)" v-for="item,index in courseList" 
        :item="item"
        :index="index"
        :itemIndex="index"
      >
        <img class='blo_left' :src="item.coverPicture"/>
        <div class='blo_center'>{{item.title}}</div>
        <div class='blo_right' v-if ='item.courseType === 2'>试读</div>

        <div class="blo_right noneborder" v-else>
          <img class='blo_right_icon' src="./../../assets/icon/icon_position@3x.png" v-if='item.statusInfo.isCurrentStudy === 1' />
          <img class='blo_right_icon' src="./../../assets/icon/icon_complete@3x.png" v-else-if="item.statusInfo.isPunchCard === 1" />
          <img class='blo_right_icon' src="./../../assets/icon/icon_unlock@3x.png" v-else-if="item.statusInfo.isUnlock === 0 && item.statusInfo.isPunchCard !== 1" />
          <img class='blo_right_icon' src="./../../assets/icon/icon_lock@3x.png" v-else-if="item.statusInfo.isUnlock === 1" />
        </div>
        
      </div>
    </div>

    <div class="getPage bottom" @click.prevent.stop="getPage(2)" v-if="courseList.length<10">点击加载后面内容</div>

  </div>
</template>
<script>
  import index from './main.js'
  export default index
</script>

<style lang="less">
  @import "./../../styles/mixins";
  .getPage {
    font-size:14px;
    font-family:PingFangSC-Light;
    color:rgba(188,188,188,1);
    line-height:18px;
    text-align: center;
    margin-bottom: 25px;
    &.bottom {
      position:relative;
      &::before{
        content:'';
        display:block;
        position:absolute;
        top:0px;
        left:20px;
        width:5px;
        height:17px;
        background-color:#ffe266;
      }
    }
  }
  .opPageList {
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    span {
      border: 1px solid #cccccc;
      height: 30px;
      width: 60px; 
      text-align: center;
      line-height: 30px;
      color: #cccccc;
    }
  }
  .course_content {
    //padding: 0 15px 20px 20px;
  }
  .course_top {
    //width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 14px;
    font-family: PingFangSC-Light;
    align-items: center;
    margin: 0 15px 20px 20px;
    .top_left {
      
      color: rgba(146,146,146,1);
      line-height: 40px;
      .le_sp {
        color: #D7AB70;
      }
    }
    .top_center {
      color: #D7AB70;
      flex: 1;
      margin-right: 25px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      .center_icon {
        background: rgba(255,255,255,0.01);
        margin-right: 3px;
      }
    }
    .top_right {
      color: #D7AB70;
      display: flex;
      justify-content: center;
      align-items: center;
      .right_icon {
        background: rgba(255,255,255,0.01);
        margin-right: 3px;
      }
    }
    .top_icon {
      width: 15px;
      height: 15px;
    }
  }
  .attempt_list {
    display: flex;
    flex-direction: column;
    margin: 15px 15px 15px 20px;
  }
  .attempt_block {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height:40px;
    margin-bottom: 30px;
    .blo_left {
      width:70px;
      height:39px;
      border-radius:3px;

    }
    .blo_center {
      flex: 1;
      margin: 0 15px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color: rgba(53,64,72,1);
      line-height: 18px;
    }
    .blo_right {
      width: 36px;
      height: 22px;
      background: rgba(255,255,255,1);
      border-radius: 3px;
      border: 1px solid rgba(188,188,188,1);
      text-align: center;
      font-size: 12px;
      font-family: PingFangSC-Light;
      color: rgba(146,146,146,1);
      line-height: 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      &.noneborder {
        border: none;
      }
    }
  }
</style>


