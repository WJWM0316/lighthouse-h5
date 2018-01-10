<template>
  <div class="classmate-item" >
    <div class="userInfo-img">
      <img class="headImg" :src="item.avatarUrl || defaultImg">
      <img class="sex"
           :src="item.gender === 1 ? boyImg : girlImg">
    </div>
    <div class="userInfo-desc">
      <div class="name" @click="handleOne">{{item.realName}}</div>
      <div class="persion-info">
        {{ isDaka ? item.career : userCareer}}
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton } from 'vux'
  import {testApi} from '@/api/pages/login'

  @Component({
    name: 'common-item',
    components: {
      XInput,
      XButton,
    },
    computed: {
      'userCareer': () => {
        console.log('this.item', this.item)
        const {workTimeName, career, office} = this.item
        console.log('career', career)
        let careerStr = ''

        if (workTimeName) {
          careerStr += workTimeName
        }
        if (careerStr && career) {
          careerStr += ' | ' + career
        } else {
          careerStr += career
        }
        if (careerStr && office) {
          careerStr += ' | ' + office
        } else {
          careerStr += office
        }
        console.log('careerStr', careerStr)
        return careerStr
      },
      'isDaka': () => {
        return this.item.identify === 1
      }
    }
  })
  export default class CommonItemIndex extends Vue {
    girlImg = require('../../assets/icon/icon_girl.png') || ''
    boyImg = require('../../assets/icon/icon_boy.png') || ''
    defaultImg = require('../../assets/icon/img_head_default.png') || ''
    created () {
    }
    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../styles/mixins";
  .classmate-item {
    margin-left: 0 15px;
    display: flex;
    align-items: center;
  }
  .userInfo-img {
    position: relative;
    .headImg{
      width: 60px;
      height: 60px;
      background: pink;
      border-radius: 50%;
    }
    & .sex {
      position: absolute;
      width: 18px;
      height: 18px;
      bottom: 0;
      right: 0;
      border-radius: 50%;
    }
  }

  .userInfo-desc {
    margin-left: 15px;

    .name {
      font-size: 15px;
      line-height: 19px;
      font-weight: 600;
      .setEllipsis(295px);
    }
    .persion-info{
      padding-top: 5px;
      font-size: 13px;
      line-height: 17px;
      color: #929292;
      .setEllipsis(295px);
    }
  }
</style>
