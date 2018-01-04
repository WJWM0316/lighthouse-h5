<template>
  <div>个人中心</div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import CommunityCard from '@/components/communityCard'

@Component({
  name: 'center-index',
  components: {
    CommunityCard
  }
})
export default class HomeIndex extends Vue {

}
</script>

<style lang="less" scoped>
.p-home-index {

}
</style>
