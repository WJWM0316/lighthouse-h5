<template>
  <div class="message-item" @click="handleOne">
    <div class="userInfo-img">
      <img class="headImg" @click.stop="handleTwo" :src="item.avatarUrl || '../../static/icon/img_head_default.png'">
    </div>
    <div class="userInfo-desc">
      <div class="desc-top">
        <div :class="item.replyIdentify === 1 ? 'name name-gold': 'name'" @click.stop="handleTwo">{{item.realName}}</div>
        <div class="after-name">{{afterNameStr[item.type]}}</div>
      </div>
      <!--文字-->
      <div class="desc-middle" v-if="item.contentType === 1">{{item.replyContent}}</div>
      <!--音频-->
      <div v-else :class="{'content-audio': true, 'not-played': !item.files[0].isPlayed}" @click.stop="audioPlay()">
        <div class="progress-container">
          <div class="progress" :style="{width: (item.progress ? item.progress : 0) + '%'}"></div>
        </div>
        <div class="audio-controller-container">
          <div class="audio-controller">
            <div :class="{play: !item.musicState, playing: item.musicState === 1, loading: item.musicState === 2}">
              <img class="icon-play" src="./../../assets/icon/music_play.png">
              <img class="icon-loading rotateZ" src="./../../assets/icon/music_loading.png">
              <img class="icon-playing" src="./../../assets/icon/music_listen.gif">
            </div>
            <span class="duration">{{item.files[0].duration}}s</span>
          </div>
        </div>
      </div>

      <div class="desc-middle-return">
        <img class="icon-zhuang" src="./../../assets/icon/icon_original.png">
        <div class="desc-middle-return-two" :class="typeStr[item.beReturnedType] ? 'desc-middle-return-text' : 'desc-middle-return-text-long'">
          {{typeStr[item.beReturnedType]}} {{item.beReturnedContents}}
        </div>
      </div>
      <div class="desc-bottom">
        <div class="send-time">{{moment(item.replyTime * 1000).format('YY-MM-DD HH:mm')}}</div>
        <div class="linght-house" @click.stop="handleThree">{{item.manito + '的' +item.Lighthouse}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { XInput, XButton } from 'vux'
  import { testApi } from '@/api/pages/login'
  import moment from 'moment'
  @Component({
    name: 'messageItme-component',
    components: {
      XInput,
      XButton,
    },
    props: {
      item: {
        type: Object,
        twoWay: true
      },
      // 对象下标
      itemIndex: {
        type: Number
      },
    },
    data () {
      return {
        audio: '',
        audioTimer: '',
        video: '',
        currVideoIndex: '',
        isAudio: true
      }
    },
    methods: {
      moment,
      handleOne (e) { // 点击跳转回复详情
        this.$emit('tap-one', this.item)
      },
      handleTwo (e) { // 点击跳转个人详情
        this.$emit('tap-two', this.item.userId, this.item.LighthouseId)
      },
      handleThree (e) { // 跳转大咖社区
        this.$emit('tap-three', this.item.LighthouseId)
      },
      /**
       * 播放对应音频
       */
      audioPlay (problemIndex) {
        let url = ''
        const itemIndex = this.itemIndex
        if (problemIndex >= 0) {
          url = this.item.answers[problemIndex].file.fileUrl
        } else {
          url = this.item.files[0].fileUrl
        }

        this.$emit('audioEvent', {
          eventType: 'play',
          url,
          itemIndex,
          problemIndex
        })
      }
    }
  })
  export default class ApplyIndex extends Vue {
    typeStr = ['', '[音频]', '[视频]', '[图片]', '[文件]', '评论导师内容']
    afterNameStr = ['', '回答了我的提问', '回答了我的追问', '评论了我的问答', '评论了我的帖子', '回复了我的评论', '评论导师内容']
    created () {

    }

    mounted () {
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../styles/mixins";
  .message-item {
    padding: 0px 15px;
    display: -webkit-box;
    .content-audio {
      margin-top: 8px;
      width: 240px;
      height: 40px;
      position: relative;

      & .progress-container, & .audio-controller-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0 20px 20px 20px;
      }

      & .progress-container {
        background-color: rgba(255, 226, 102, 0.4);
        overflow: hidden;
      }
      & .progress {
        background-color: #ffe266;
        height: 100%;
        width: 0;
      }

      & .audio-controller {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
      }

      & .play .icon-play{
        display: block;
      }
      & .loading .icon-loading{
        display: block;
      }
      & .playing .icon-playing{
        display: block;
      }
      & .duration {
        color: #666666;
        font-size: 15px;
      }

      &.not-played:after {
        content: '';
        position: absolute;
        right: -8px;
        top: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff3434;
      }
    }
    .userInfo-img {
      padding: 20px 0;
      position: relative;
      .headImg{
        width: 50px;
        height: 50px;
        background: pink;
        border-radius: 50%;
        .sex {
          position: absolute;
          width: 18px;
          height: 18px;
          bottom: 0;
          right: 0;
          border-radius: 50%;
        }
      }
    }

    .userInfo-desc {
      margin-left: 15px;
      padding: 20px 0;
      border-bottom: 1px solid #ededed; /* no */
      .desc-top{
        margin-bottom: 7px;
        .setEllipsis(285px);
        .name {
          display: inline;
          font-size: 15px;
          line-height: 19px;
          font-weight: 600;
          width: 295px;
          color: #576b95;
        }
        .name-gold{
          color: #d7ab70;
        }
        .after-name{
          display: inline;
          margin-left: 5px;
          font-size: 14px;
          color: #929292;
          }
        }
      .desc-middle{
        .setEllipsis(285px);
      }
      .desc-middle-return{
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-top: 7px;
        color: #929292;
        .desc-middle-return-text{
          .setEllipsis(265px);
          height: 20px;
        }
        .desc-middle-return-text-long{
          .setEllipsis(265px);
          height: 20px;
        }
        .desc-middle-return-two{
          margin-right: 4px;
          font-size: 13px
        }
      }
      .desc-bottom{
        font-size: 13px;
        color: #929292;
        margin-top: 7px;
        display: flex;
        justify-content: space-between;
        .send-time{

        }
        .linght-house{
          text-align: right;
          .setEllipsis(130px);
        }
      }
      .persion-info{
        padding-top: 5px;
        font-size: 13px;
        line-height: 17px;
        color: #929292;
        .setEllipsis(295px);
      }
    }
    .content-audio {
      width: 240px;
      height: 40px;
      position: relative;

      & .progress-container, & .audio-controller-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0 20px 20px 20px;
      }

      & .progress-container {
        background-color: rgba(255, 226, 102, 0.4);
        overflow: hidden;
      }
      & .progress {
        background-color: #ffe266;
        height: 100%;
        width: 0;
      }

      & .audio-controller {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
      }

      & .play .icon-play{
        display: block;
      }
      & .loading .icon-loading{
        display: block;
      }
      & .playing .icon-playing{
        display: block;
      }
      & .duration {
        color: #666666;
        font-size: 15px;
      }

      &.not-played:after {
        content: '';
        position: absolute;
        right: -7px;
        top: 0;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #ff3434;
      }
    }
    .not-played:after {
      content: '';
      position: absolute;
      right: -7px;
      top: 0;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ff3434;
    }
    & .icon-zan, & .icon-pinglun {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 2px;
    }
    & .icon-loading, & .icon-play, & .icon-playing {
      display: none;
      width: 18px;
      height: 18px;
    }
    & .rotateZ {
      animation: rotateZ linear 1s infinite;
    }
    .icon-zhuang{
      margin-right: 4px;
      width: 15px;
      height: 15px;
    }
  }

</style>
