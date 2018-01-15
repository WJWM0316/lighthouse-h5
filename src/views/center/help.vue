<template>
  <div class="p-body p-center-help">
    <div class="rich-text">
      <h3 style="text-align: center; ">“小灯塔Lite”小程序使用帮助</h3>
      <p><b><br></b></p>
      <p><b><br></b></p><h4>给学员的使用帮助</h4>
      <p><b><br></b></p>
      <p>一、如何寻找心仪的导师灯塔？</p>
      <p><br></p>
      <p style="text-indent: 0px;">我们在首页为你推荐全部精选灯塔列表，可以点击进入灯塔详细介绍页，浏览并找到适合你的灯塔。</p>
      <p><br></p>
      <p>二、如何加入心仪导师的灯塔？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您可以通过付费加入或免费集Call的方式加入心仪导师的灯塔。</p>
      <p><br></p>
      <p style="text-indent: 0px;">1.付费加入：您可以在灯塔介绍页底部找到付费加入的按钮，点击即可付费加入。（若没有按钮，则代表该灯塔已满或不允许付费加入）</p>
      <p><br></p>
      <p style="text-indent: 0px;">
        2.免费加入：您可以在灯塔介绍页底部找到“免费集Call加入”按钮，点击会跳转到免费集Call的页面，按照页面指引将页面分享给微信好友或微信群聊，集Call达到一定数量即可免费加入。（若没有按钮，则代表该灯塔已满或不允许付费加入）&nbsp;</p>
      <p><br></p>
      <p>三、如何向导师提问？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您需要先加入导师的灯塔，加入后即可在导师灯塔灯塔内点击提问按钮跳转到提问的页面，根据页面指引向导师提问。</p>
      <p><br></p>
      <p>四、如何得知导师已经回答了我的提问？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您的提问得到导师回答后，你会在微信【服务通知】服务号内收到一条通知消息，您可以点击消息快速跳转查看导师的回答。</p>
      <p style="text-indent: 0px;">您也可以在微信的【发现】-【小程序】里找到小灯塔Lite小程序，在【消息】中，或者是灯塔内向导师提问的页面查看导师的回答。</p>
      <p><br></p>
      <p>五、如何向导师和其它学院申请交换微信？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您需要先加入导师的灯塔，加入后即可在导师灯塔内，点击导师或其他学院的头像或姓名，进入他们的个人主页，在主页底部可以申请交换微信。</p>
      <p style="text-indent: 0px;">友情提示：要完善了个人信息才能交换微信哦~</p>
      <p><br></p>
      <p>六、如何处理我收到的和我发出的交换微信申请？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您可以在小程序【消息】中，点击顶部【申请交换微信消息】入口，即可进入申请的管理页面，分别管理收到和发出的交换微信申请记录。</p>
      <p><br></p><h4>给导师的使用帮助</h4>
      <p><b><br></b></p>
      <p>一、如何管理自己的灯塔？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您可以在首页找到您自己开设的灯塔，点击进入即可在灯塔进行发布动态、回答问题等管理。</p>
      <p><br></p>
      <p>二、如何发布内容？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您在您的灯塔详情页下方可以找到发布内容按钮，点击即可进入发布内容的页面。</p>
      <p style="text-indent: 0px;">可以发布的内容包括：文字、图片、视频、语音。</p>
      <p><br></p>
      <p>三、如何回答学员提出的问题？</p>
      <p><br></p>
      <p style="text-indent: 0px;">
        您在您的灯塔页面最下方可以找到回答问题按钮，点击可以进入您所需回答的问题列表，在列表中筛选出所有需要回答的问题，点击问题进入问题详情页并作答。您可以用语音和文字两种方式进行作答。</p>
      <p><br></p>
      <p>四、如何处理学员的交换微信申请？</p>
      <p><br></p>
      <p style="text-indent: 0px;">您可以在小程序【消息】中，点击页面顶部的交换微信申请消息按钮，进入即可对您收到的交换微信申请进行处理。</p>
      <p><br></p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { share } from '@/api/wx/share'

@Component({
  name: 'center-help'
})
export default class CenterHelp extends Vue {
  created () {
    share(this.$wechat, this.$http, {
      'titles': '小灯塔使用帮助',
      'title': '小灯塔使用帮助',
      'desc': '百万职场人的职场导师知识分享社区，等你加入~',
      'imgUrl': '',
      'link': location.href.split('?')[0]
    })
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.p-center-help {
  padding: 15px;

  .rich-text {
    .setRichTextWrap();
    font-size: 15px;
  }
}
</style>

