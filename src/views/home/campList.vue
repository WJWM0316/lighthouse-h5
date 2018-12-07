<template>
  <div class="campList">
  <div v-for="(item, index) in list.communities">
    <camp-care :item="item"></camp-care>
  </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import campCare from '@/components/trainingCamp/trainingCamp'
import { getTrainingsListApi } from '@/api/pages/pageInfo'
@Component({
  components:{
    campCare
  }
})
export default class camp extends Vue {
  list = []
  async created () {
    let res = await getTrainingsListApi()
    console.log(res, 888888888888888)
    this.list = res
  }
}
</script>

<style lang="less" scoped="scoped">
.campList{
  padding: 12px 0;
}
</style>