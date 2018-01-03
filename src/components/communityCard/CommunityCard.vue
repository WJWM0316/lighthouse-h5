<template>
  <a href="#" class="m-community" :class="cardClasses" @click.prevent.stop="handleTap">
    <div class="cover-container">
      <image-item class="cover" :src="''" mode="horizontal" />
      <div class="master">
        <h3 class="name" :class="{ round: type === 1 }">
          <span class="text">名字</span>
        </h3>
        <p class="career">头衔</p>
      </div>
      <slot name="cover-addon"></slot>
    </div>
  </a>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'community-card',
  props: {
    // 大咖信息
    community: {
      type: Object,
      default () {
        return {}
      }
    },

    // 类型：1为列表页卡片，2为详情页卡片
    type: {
      type: Number,
      default: 1
    }
  }
})
export default class CommunityCard extends Vue {
  // 卡片类名集合
  cardClasses = {
    [`type-${this.type}`]: true,
    'z-joined': this.community.isJoined === 1,
    'z-full': this.community.remainingJoinNum <= 0,
    'z-unread': this.community.newMessage
  }
  /**
   * 点击卡片
   */
  handleTap (e) {
    // 列表页才触发点击
    this.$emit('tap-card', this.community)
  }
}
</script>

<style lang="less">
@import "../../styles/variables";
@import "../../styles/mixins";

.m-community {
  display: block;

  &.type-1 {

    .cover-container {

      .cover {
        border-radius: 3px;
      }

      .master {
        border-radius: 0 0 3px 3px;

        .name {
          .text {
            .setEllipsis();
          }
        }

        .career {
          .setEllipsis();
          font-size: 11px;
        }
      }
    }

    .info {
      .title {
        .setEllipsis();
      }

      .desc {
        .setEllipsis();
      }
    }
  }

  &.type-2 {

    .cover-container {
      height: 245px;

      .master {
        padding-bottom: 17px;
      }
    }

    .info {
      padding: 0 15px;
    }
  }

  &.z-unread {

    .cover-container {

      .master {

        .name {

          &::after {
            content: " ";
          }
        }
      }
    }
  }

  .cover-container {
    position: relative;
    margin-bottom: 10px;
    height: 226px;

    .cover {
      background: #ccc;
      width: 100%;
      height: 100%;
    }

    .master {
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 12px;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2));
      width: 100%;
      color: #fff;

      .name {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        line-height: 1;
        font-size: 0;

        .text {
          display: inline-block;
          line-height: 40px;
          font-size: 27px;
        }

        &.round {
          padding: 0 8px;
          background: #ffe266;
          border-radius: 11px;
          text-align: center;
          color: #354048;

          .text {
            line-height: 22px;
            font-size: 13px;
          }
        }

        &::after {
          content: none;
          display: block;
          box-sizing: border-box;
          position: absolute;
          right: -5px;
          top: -3px;
          background-color: #ff3434;
          width: 12px;
          height: 12px;
          border: solid 2px #fff;
          border-radius: 50%;
        }
      }

      .career {
        margin-bottom: -7px;
        display: block;
        line-height: 24px;
        font-size: 13px;
      }
    }
  }

  .info {

    .title {
      display: block;
      line-height: 24px;
      font-weight: normal;
      font-size: 18px;
    }

    .desc {
      display: block;
      margin-bottom: 10px;
      line-height: 21px;
      font-size: 13px;
      color: #929292;
    }

    .bottom {
      display: flex;
      font-size: 13px;
      line-height: 19px;
      color: #929292;

      .left {
        flex: 1 1 auto;

        .countdown {
          margin-right: 5px;
          color: #d7ab70;
        }

        .time-range {
          color: #bcbcbc;
        }
      }

      .right {
        flex: 0 0 auto;

        .residue {

          .number {
            color: #d7ab70;
          }
        }
      }
    }
  }
}
</style>
