<template>
  <div class="p-exchange-list">
    交换列表
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton } from 'vux'
  import {testApi} from '@/api/pages/login'

  @Component({
    name: 'login-index',
    components: {
      XInput,
      XButton,
    }
  })
  export default class ExchangeListIndex extends Vue {
    abc = ''
    created () {
    }
    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  .p-exchange-list{

  }
</style>

