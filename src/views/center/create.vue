<template>
  <div class="p-body p-center-create">
    <group label-width="400px" label-margin-right="10" label-align="left" class="p-group">
      <popup-picker class="" title="灯塔类别" placeholder="请选择灯塔类型" :data="lightHouseType" v-model="params.type"
                    value-text-align="left"></popup-picker>
      <x-input class="margintop50" title="一句话介绍" placeholder="例如：走向百万年薪之类"
               :showClear="false"
               v-model="params.introduce"></x-input>
      <cell title="你的优势" class="margintop50 noboder"></cell>
      <textarea class="common-textarea" placeholder="请尽量说明您的优势，例如您有怎样的行业或项目经历？获得过什么样的殊荣？"
                :rows="4" v-model="params.value" maxlength="1000"></textarea>
      <cell title="灯塔价值" class="margintop50 noboder nobefore"></cell>
      <textarea class="common-textarea" placeholder="您想向学员传输什么样的话题或内容？学员都可以获得什么？"
                :rows="4" v-model="params.advantage" maxlength="1000"></textarea>
    </group>
    <div class="agree-container">确定创建则代表您已确认并同意<span class="lighthouse-agree">《创建灯塔协议》</span></div>
    <div class="btn-group">
      <div class="create-btn">确定创建灯塔</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Group, XTextarea, PopupPicker, XInput, Cell } from 'vux'

  @Component({
    name: 'center-create',
    components: {
      Group, XTextarea, PopupPicker, XInput, Cell
    },
  })
  export default class CenterCreate extends Vue {
    params = {
      type: [],
      introduce: '',
      advantage: '',
      value: ''
    }
    lightHouseType = [
//      {name: '第一个', value: 1},
//      {name: '第二个', value: 2},
//      {name: '第三个', value: 3}
    ]
  }
</script>

<style lang="less" type="text/less">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .p-center-create {
    box-sizing: content-box;
    margin-right: 100px;
    width: 100%;

    .weui-cells {
      font-size: 15px;
    }
    .weui-cells:before, .weui-cells:after {
      border: 1px solid transparent;
    }
    .noboder {
      border-bottom: transparent;
    }
    .nobefore:before {
      border: transparent;
    }
    .margintop50 {
      padding-top: 25px;
    }
    .p-group {
      .mr15 {
        margin-right: 15px;
      }
      .common-textarea {
        border-radius: 3px;
        margin-left: 15px;
        padding: 15px;
        width: 310px;
        border: 1px solid #ededed;
        background: #fbfbfb;
      }
    }
    .agree-container {
      color: #bcbcbc;
      margin-top: 15px;
      margin-left: 15px;
      .lighthouse-agree {
        color: #d7ab70;
      }
    }
    .btn-group {
      border-top: 1px solid #ededed;
      padding: 12px 20px;
      margin-top: 13px;
      .create-btn {
        border-radius: 22px;
        background: #ffe266;
        width: 100%;
        height: 44px;
        line-height: 44px;
        text-align: center;
      }
    }
  }
</style>

