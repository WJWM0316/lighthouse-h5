<template>
  <div class="campList">
    <scroller  @infinite-scroll="handlePullup" @scroll="scroll" :refreshable="false" :is-none-data="noData">
      <div v-for="(item, index) in list">
        <camp-care :item="item"></camp-care>
      </div>
    </scroller>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import campCare from '@/components/trainingCamp/trainingCamp'
import { getTrainingsListApi } from '@/api/pages/pageInfo'
import Scroller from '@/components/scroller'
@Component({
  name: 'campList',
  components: {
    campCare,
    Scroller
  },
  computed: {
    noData () {
      return this.pagination.currentPage === this.pagination.lastPage
    }
  }
})
export default class camp extends Vue {
  list = ''
  pagination = ''
  page = 1
  isBusy = false
  
  async getgetTrainingsList () {
    let res = await getTrainingsListApi({page: this.page})
    if (this.list) {
      this.list = [...this.list, ...res.communities]
    } else {
      this.list = res.communities
    }
    this.pagination = res.pagination
    this.isBusy = false
  }
  
  created () {
    this.getgetTrainingsList()
  }
  
  handlePullup (loaded) {
    if (this.isBusy) return
    this.isBusy = true
    this.page += 1
    this.getgetTrainingsList()
    loaded('done')
  }
  scroll () {}
}
</script>

<style lang="less" scoped="scoped">
.campList{
  height: 100%;
  padding: 12px 0;
}
</style>