<template>
  <view class="message-item" catchtap="handleOne">
    <view class="userInfo-img">
      <image class="headImg" catchtap="handleTwo" src="{{item.avatarUrl || '../../static/icon/img_head_default.png'}}" catchtap="handleOne">
      </image>
    </view>
    <view class="userInfo-desc">
      <view class="desc-top"><text class="{{item.replyIdentify === 1 ? 'name name-gold': 'name'}}" catchtap="handleTwo">{{item.realName}}</text><text class="after-name">{{item.afterNameStr}}</text></view>
      <!--文字-->
      <block wx:if="{{item.contentType === 1}}">
        <view class="desc-middle">{{item.replyContent}}</view>
      </block>
      <!--音频-->
      <block wx:else>
        <view class="content-audio not-played" :class="{'not-played': !item.files[0].isPlayed}" @tap.stop="audioPlay({{item}}, {{itemIndex}})">
          <view class="progress-container">
            <view class="progress" style="width: {{item.progress}}%"></view>
          </view>
          <view class="audio-controller-container">
            <view class="audio-controller">
              <view :class="{play: !item.musicState, playing: item.musicState === 1, loading: item.musicState === 2}">
                <image class="icon-play" src="./../../static/icon/music_play.png"></image>
                <image class="icon-loading rotateZ" src="./../../static/icon/music_loading.png"></image>
                <image class="icon-playing" src="./../../static/icon/music_listen.gif"></image>
              </view>
              <text class="duration">{{item.files[0].duration}}s</text>
            </view>
          </view>
        </view>
      </block>
      <view class="desc-middle-return">
        <image class="icon-zhuang" src="./../../static/icon/icon_original.png"></image>
        <text class="{{item.beReturnedTypeStr ? 'desc-middle-return-text' : 'desc-middle-return-text-long'}}"><text style="margin-right: 8rpx;font-size: 26rpx;">{{item.beReturnedTypeStr}}</text>{{item.beReturnedContents}} </text>
      </view>
      <view class="desc-bottom">
        <view class="send-time">{{item.replyTimeStr}}</view>
        <view class="linght-house" catchtap="handleThree">{{item.manito + '的' +item.Lighthouse}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  import wepy from 'wepy'
  export default class Index extends wepy.component {
    components = {
    }
    props = {
      item: {
        type: Object,
        twoWay: true
      },
      // 对象下标
      itemIndex: {
        type: Number
      },
    }
    data = {
      audio: '',
      audioTimer: '',
      video: '',
      currVideoIndex: '',
      isAudio: true
    }

    methods = {
      handleOne (e) { // 点击跳转回复详情
        this.$emit('tap-one', this.item)
      },
      handleTwo (e) { // 点击跳转个人详情
        this.$emit('tap-two', this.item.userId, this.item.LighthouseId)
      },
      handleThree (e) { // 跳转大咖社区
        this.$emit('tap-three', this.item.LighthouseId)
      },
      audioPlay (item, index) {
        if (!this.isAudio) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用音频功能，请升级到最新微信版本后重试。'
          })
          return
        }
        let state = 0
        // 播放状态 0 未播放 1 playing 2 loading
        clearInterval(this.audioTimer)
        if (item.musicState) { // 已播放
          this.audio.pause()
          state = 0
        } else { // 未播放
          if (item.progress) { // 如果播放为上次暂停音频 继续播放
            this.audio.play()
          } else {
            if (this.audio.src) { // 如果播放为其他音频 中止播放 切换音频
              this.audio.stop()
            }
            console.log('item.files[0].fileUrl', item.files[0].fileUrl)
            this.audio.src = item.files[0].fileUrl
          }
          state = 1
          this.audioTimer = setInterval(() => {
            const {currentTime, duration} = this.audio
            if (currentTime <= duration) {
              this.$emit('audioEvent', {
                eventType: 'time-update',
                currentTime,
                duration,
                index
              })
            } else {
              clearInterval(this.audioTimer)
            }
          }, 300)
        }
        this.$emit('audioState', {
          index,
          state
        })
      },
    }
    computed = {
    }

    events = {
      'page-destroy': ($event) => {
        this.audio.stop()
        clearInterval(this.audioTimer)
        this.audio = ''
        this.video = ''
        this.currVideoIndex = ''
      }
    }

    onLoad () {
      console.log('onload item')
      if (wx.createInnerAudioContext) {
        // 音频控制器
        const audio = wx.createInnerAudioContext()
        audio.autoplay = true
        audio.onWaiting(() => {
          this.$emit('audioEvent', {
            eventType: 'waiting'
          })
        })
        audio.onCanplay(() => {
          this.$emit('audioEvent', {
            eventType: 'canPlay'
          })
        })
        audio.onEnded(() => {
          audio.pause()
          clearInterval(this.audioTimer)
          this.$emit('audioEvent', {
            eventType: 'end'
          })
        })
        // audio.onTimeUpdate(() => {
        // })
        this.audio = audio
      } else {
        this.isAudio = false
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用音频功能，请升级到最新微信版本后重试。'
        })
      }
    }
    onShow () {
    }
  }
</script>

<style lang="less">
  @import "../../styles/mixins";
  .message-item {
    padding: 0rpx 30rpx;
    display: flex;

    .userInfo-img {
      padding: 40rpx 0;
      position: relative;
      .headImg{
        width: 100rpx;
        height: 100rpx;
        background: pink;
        border-radius: 50%;
      }
      & .sex {
        position: absolute;
        width: 36rpx;
        height: 36rpx;
        bottom: 0;
        right: 0;
        border-radius: 50%;
      }
    }

    .userInfo-desc {
      margin-left: 30rpx;
      padding: 40rpx 0;
      border-bottom: 1rpx solid #ededed;
      .desc-top{
        width: 570rpx;
        margin-bottom: 14rpx;
        .setSingleLine();
        .name {
          font-size: 30rpx;
          line-height: 38rpx;
          font-weight: 600;
          width: 590rpx;
          color: #576b95;
        }
        .name-gold{
          color: #d7ab70;
        }
        .after-name{
          margin-left: 10rpx;
          font-size: 28rpx;
          color: #929292;
          }
        }
      .desc-middle{

        width: 570rpx;
        .setSingleLine();
      }
      .desc-middle-return{
        display: flex;
        align-items: center;
        font-size: 26rpx;
        margin-top: 14rpx;
        color: #929292;
        .desc-middle-return-text{
          .setSingleLine();
          width: 530rpx;
          height: 40rpx;
        }
        .desc-middle-return-text-long{
          .setSingleLine();
          width: 530rpx;
          height: 40rpx;
        }
      }
      .desc-bottom{
        font-size: 26rpx;
        color: #929292;
        margin-top: 14rpx;
        display: flex;
        justify-content: space-between;
        .send-time{

        }
        .linght-house{
          text-align: right;
          width: 260rpx;
          .setSingleLine();
        }
      }
      .persion-info{
        padding-top: 10rpx;
        font-size: 26rpx;
        line-height: 34rpx;
        color: #929292;
        width: 590rpx;
        .setSingleLine();
      }
    }
    .content-audio {
      width: 480rpx;
      height: 80rpx;
      position: relative;

      & .progress-container, & .audio-controller-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0 40rpx 40rpx 40rpx;
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
        padding: 0 30rpx;
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
        font-size: 30rpx;
      }

      &.not-played:after {
        content: '';
        position: absolute;
        right: -15rpx;
        top: 0;
        width: 15rpx;
        height: 15rpx;
        border-radius: 50%;
        background: #ff3434;
      }
    }
    .not-played:after {
      content: '';
      position: absolute;
      right: -15rpx;
      top: 0;
      width: 15rpx;
      height: 15rpx;
      border-radius: 50%;
      background: #ff3434;
    }
    & .icon-zan, & .icon-pinglun {
      display: inline-block;
      width: 30rpx;
      height: 30rpx;
      margin-right: 4px;
    }
    & .icon-loading, & .icon-play, & .icon-playing {
      display: none;
      width: 36rpx;
      height: 36rpx;
    }
    & .rotateZ {
      animation: rotateZ linear 1s infinite;
    }
    .icon-zhuang{
      margin-right: 8rpx;
      width: 30rpx;
      height: 30rpx;
    }
  }

</style>
