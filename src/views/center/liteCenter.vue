<template>
  <div class="p-lite-center p-body">
    <ul class="community-list">
      <li>
        <div class="bd">
          <div class="left">
            <h3 class="title">通往百万年薪之路</h3>
            <p class="desc">我曾经实现，相信你也可以做得到</p>
            <div class="other">
              <p class="status">招募中</p>
              <p class="time"><span class="countdown">22 天 06：33：52</span> 后开启</p>
            </div>
          </div>
          <div class="cover">
            <image-item class="image-item" :src="''" mode="horizontal" />
          </div>
        </div>
        <footer class="ft">
          <a href="#" class="share u-btn"><i class="u-icon-share-gray" /> 分享</a>
          <a href="#" class="free u-btn">免费学员(50)</a>
          <a href="#" class="pay u-btn">付费学员(250)</a>
        </footer>
      </li>
      <li>
        <div class="bd">
          <div class="left">
            <h3 class="title">通往百万年薪之路</h3>
            <p class="desc">我曾经实现，相信你也可以做得到</p>
            <div class="other">
              <p class="status">已开启</p>
              <p class="time">2018-03-01 至 2018-07-01</p>
            </div>
          </div>
          <div class="cover">
            <image-item class="image-item" :src="''" mode="horizontal" />
          </div>
        </div>
        <footer class="ft">
          <a href="#" class="share u-btn"><i class="u-icon-share-gray" /> 分享</a>
          <a href="#" class="free u-btn">免费学员(50)</a>
          <a href="#" class="pay u-btn">付费学员(250)</a>
        </footer>
      </li>
      <li>
        <div class="bd">
          <div class="left">
            <h3 class="title">通往百万年薪之路</h3>
            <p class="desc">我曾经实现，相信你也可以做得到</p>
            <div class="other">
              <p class="status">已满员</p>
              <p class="time">2018-03-01 至 2018-07-01</p>
            </div>
          </div>
          <div class="cover">
            <image-item class="image-item" :src="''" mode="horizontal" />
          </div>
        </div>
        <footer class="ft">
          <a href="#" class="share u-btn"><i class="u-icon-share-gray" /> 分享</a>
          <a href="#" class="free u-btn">免费学员(50)</a>
          <a href="#" class="pay u-btn">付费学员(250)</a>
        </footer>
      </li>
      <li>
        <div class="bd">
          <div class="left">
            <h3 class="title">通往百万年薪之路</h3>
            <p class="desc">我曾经实现，相信你也可以做得到</p>
            <div class="other">
              <p class="status">已结束</p>
              <p class="time">停止报名</p>
            </div>
          </div>
          <div class="cover">
            <image-item class="image-item" :src="''" mode="horizontal" />
          </div>
        </div>
        <footer class="ft">
          <a href="#" class="share u-btn"><i class="u-icon-share-gray" /> 分享</a>
          <a href="#" class="free u-btn">免费学员(50)</a>
          <a href="#" class="pay u-btn">付费学员(250)</a>
        </footer>
      </li>
    </ul>

    <footer class="g-footer">
      <a href="#" class="create u-btn">创建新灯塔</a>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'lite-center'
})
export default class CenterLiteCenter extends Vue {}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-lite-center {
  background: #f8f8f8;

  .community-list {

    & > li {
      margin-bottom: 10px;
      background: #fff;
    }

    .bd {
      .setFlex();
      padding: 20px 15px 15px;

      .left {
        flex: 1 1 auto;

        .title {
          line-height: 22px;
          font-size: 18px;
        }

        .desc {
          margin-bottom: 3px;
          line-height: 24px;
          font-size: 13px;
          color: #666;
        }

        .other {
          line-height: 1;

          .status,
          .time {
            display: inline-block;
            vertical-align: middle;
            line-height: 20px;
            font-size: 13px;
          }

          .status {
            padding: 0 8px;
            background: rgba(255, 226, 102, .15);
            min-width: 56px;
            text-align: center;
            color: @color-primary;

            &.z-overed {
              background: #f8f8f8;
              color: #bcbcbc;
            }
          }

          .time {
            color: #929292;

            .countdown {
              color: @color-primary;
            }
          }
        }
      }

      .cover {
        flex: 0 0 auto;

        .image-item {
          background: #ccc;
          width: 70px;
          height: 70px;
          border-radius: 3px;
        }
      }
    }

    .ft {
      .setFlex();
      border-top: solid 1px #ededed; /* no */

      .u-btn {
        box-sizing: border-box;
        position: relative;
        flex: 1 1 auto;
        padding: 14px 15px 12px;
        line-height: 24px;
        font-size: 15px;
        color: @font-color-default;

        &:active {
          background: #f1f1f1;
        }

        &:not(:last-child)::after {
          content: " ";
          display: block;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -12px;
          background: #ededed;
          width: 1px; /* no */
          height: 24px;
        }

        &.share {
          flex: 0 0 auto;
          min-width: 88px;
        }
      }
    }
  }
}
</style>
