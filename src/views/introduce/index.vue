<template>
  <div class="big-shot-introduce">
    <dynamic :data="dynamicList"
             :hideCommentArea="true"
    ></dynamic>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import dynamic from '@/components/dynamic/dynamic'
  import {getCommunityInfoApi} from '@/api/pages/pageInfo.js'

  @Component({
    name: 'big-shot-introduce',
    components: {
      dynamic
    },
    computed: {
      dynamicList () {
        return this.pageInfo.circles || []
      }
    }
  })
  export default class introduce extends Vue {
    pageInfo = {}

    created () {
      this.pageInit().then(() => {})
    }

    async pageInit () {
      const { communityId } = this.$route.params
      const res = await getCommunityInfoApi(communityId)
      console.log(res)
      this.pageInfo = res
    }
  }
</script>

<style lang="less" scoped>
  .big-shot-introduce {
    padding-bottom: 108px;

    & .header {
    }

    & .container {
      margin-top: 40px;
    }

    & .module {

      &.h5-code {
      }

      .module-title {
        margin: 0 30px;
        font-size: 36px;
        color: #929292;
        font-weight: 500;

        & text {
          display: block;
          padding: 60px 0 20px;
        }
      }
      .module-content {

        &.h5-code {
          padding: 0 30px;
          font-size: 30px;
          word-wrap: break-word;
          width: 100%;
          box-sizing: border-box;

          & img {
            max-width: 100% !important;
          }
        }
      }

      & .hr {
        height: 1px;
        background: #dcdcdc;
      }

      & .desc {
        color: #bcbcbc;
        font-size: 26px;
        padding: 40px 0;
        text-align: center;
      }
    }

    & .footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 108px;
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #bcbcbc;
      z-index: 999;

      & text {
        font-size: 30px;
      }

      & .time-clock {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #ffffff;
        box-shadow: 0 -1px 0 0 #dcdcdc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        color: #666666;
        & text:last-of-type {
          margin-left: 30px;
          color: #d7ab70;
        }
      }

      & form {
        flex-grow: 1;
        height:100%;
      }
      & button {
        flex-grow: 1;
        height: 100%;
        font-size: 26px;
        line-height: 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        border-style: none;
        border-radius: 0;
        border-top: solid 1px #dcdcdc;
        &:after {
          border-style: none;
        }

        & text {
          display: block;
          margin-top: 12px;
        }
        & text:first-of-type {
          margin-top: 0;
          font-size: 30px;
        }

        &.free-btn {
          color: #d7ab70;
          background-color: #ffffff;
        }
        &.pay-btn {
          color: #354048;
          background-color: #ffe266;
          & text:not(:first-of-type) {
            color: rgba(53, 64, 72, 0.8);
          }
        }
        &.free-btn-disable, &.pay-btn-disable {
          color: #bcbcbc;
        }
      }
    }

    .rich-text {
      display: block;
      max-width: 100%;
      line-height: 1.5;
      font-size: 32px;
      overflow: hidden;
    }
  }
</style>
