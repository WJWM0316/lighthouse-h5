<template>
  <div class="p-body p-center-create">
    <group label-width="400px" label-margin-right="10" label-align="left" class="p-group">
      <popup-picker title="灯塔类别" placeholder="请选择灯塔类型" :data="lightHouseType" v-model="params.type"
                    value-text-align="left"></popup-picker>
      <x-input class="margintop50" title="一句话介绍" placeholder="例如：走向百万年薪之类" v-model="params.introduce"></x-input>
      <cell title="你的优势" class="margintop50 noboder"></cell>
      <x-textarea placeholder="请尽量说明您的优势，例如您有怎样的行业或项
目经历？获得过什么样的殊荣？" :show-counter="false" :rows="3" v-model="params.value"></x-textarea>
      <cell title="灯塔价值" class="margintop50 noboder"></cell>
      <x-textarea placeholder="您想向学员传输什么样的话题或内容？学员都可
以获得什么？" :show-counter="false" :rows="3" v-model="params.advantage"></x-textarea>
    </group>
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
    font-size: 10px;
    .weui-cells:before, .weui-cells:after {
      border: 1px solid transparent;
    }
    .noboder{
      border-bottom: transparent;
    }
    .margintop50{
      padding-top: 20px;
    }
  }
</style>

