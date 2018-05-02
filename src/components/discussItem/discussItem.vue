<template>
  <!-- 评论列表项 -->
  <div class="discuss-item" @click.stop="comment">

    <!-- 头像 -->
    <div class="left">
    <img :src="item.reviewer.avatar" class="user-image" @click.stop="toUserInfo(item.reviewer.userId)" />
    </div>

    <div :class="{right: true, border: !hideBorder}">
      
      <div class="content-head">
        <div class="user-box" v-if="role && role.isShow">
          <div style="width:100%">
            <!-- 用户名 -->
            <p class="user-name" :class="role && role.title === '塔主' || role.title === '嘉宾' ? 'master' : 'guest'" @click.stop="toUserInfo(item.reviewer.userId)">{{item.reviewer.realName}}<span class="label" v-if="role && role.title === '管理员'">{{role.title}}</span></p>
            <!-- 用户头衔 -->
            <p class="user-career" v-if="role && role.title"  v-text="item.reviewer.career"></p>
          </div>
        </div>
        <div class="other-box"v-else>
          <div>
            <!-- 用户名 -->
            <span class="user-name guest" @click.stop="toUserInfo(item.reviewer.userId)">{{item.reviewer.realName}}</span>
            <!-- 用户头衔 -->
          </div>
        </div>
      </div>
      <!-- 内容区分 -->
      <!-- -------------------------------------------------------------- -->

      <!-- 评论类型 -->
      <!-- 发表内容 类型: 指定回复人 无指定回复人 -->
      <div class="publish-content">

        <!-- 指定回复人 -->
        <p class="content-text" v-if="item.isReceiver">回复<span style="color: #4080AD; display: inline-block; z-index: 9;" @click.stop="toUserInfo(item.receiver.userId)">{{item.receiver.realName}}</span>：{{item.content}}</p>
        <!-- 无指定回复人 -->
        <p class="content-text" v-else>{{item.content}}</p>

      </div>

      <!-- -------------------------------------------------------------- -->

      <!-- 尾部 -->
      <div class="info-area">
        <div>
          <span>{{timeStr}}</span>
          <span v-if="showIdentification && item.modelType === 'problem'"> · 问答</span>
          <span v-else-if="showIdentification && item.modelType === 'post'"> · 帖子</span>
          <span v-if="showDelBtn && item['isSelf'] && item.modelType  !== 'problem'" class="del-btn" @click.stop="del">删除</span>
        </div>

        <div class="operation">
          <!-- 点赞按钮 -->
          <button v-if="!hidePraiseBtn" @click.stop="praise">
            <img v-if="item.isFavor" class="icon-zan" src="./../../assets/icon/bnt_zan_pre@3x.png" />
            <img v-else class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
            {{item.favorTotal > 0 ? item.favorTotal : ''}}
          </button>
          <!-- 评论按钮 -->
          <button v-if="!hideCommentBtn" @click.stop="comment">
            <img class="icon-pinglun" src="./../../assets/icon/bnt_comment@3x.png" />
            {{item.commentTotal > 0 ? item.commentTotal : ''}}
          </button>
          <!-- 灯塔信息 -->
          <div class="info-light-house" v-if="showLightHouseInfo">
            <span>{{item.Lighthouse}}</span>
          </div>
        </div>
      </div>


      <!-- 评论区 -->
      <div class="comment-area" v-if="!hideCommentArea && (item.favorTotal > 0 || item.commentTotal > 0)" @click="commentAreaClick">
        <!-- 点赞信息 -->
        <div class="praise-block" v-if="item.favorTotal > 0">
          <img class="icon-zan" src="./../../assets/icon/zan2@3x.png" />
          <div class="praise-name">
            <span class="favor-name" v-for="(favor, favorIndex) in item.favors" @click.stop="toUserInfo(favor.userId)">{{favorIndex < 1 ? favor.realName : ',' + favor.realName}}</span>
          </div>
          <span class="praise-total" v-if="item.favorTotal > 3">等{{item.favorTotal}}人觉得很赞</span>
        </div>

        <!-- 评论信息 -->
        <div class="reply-block" v-if="item.commentTotal > 0">
          <div class="reply" v-for="(reply,index) in item.childComments" v-if="index<3">
            <template v-if="reply.isReceiver">
              <p>
                <span class="favor-name" @click.stop="toUserInfo(reply.reviewer.userId)">{{reply.reviewer.realName}}</span> 回复 <span class="favor-name" @click.stop="toUserInfo(reply.receiver.userId)">{{reply.receiver.realName}}</span>：{{reply.content}}
              </p>
            </template>
            <template v-else>
              <p>
                <p v-if="reply.realName"><span class="favor-name" @click.stop="toUserInfo(reply.reviewer.userId)">{{reply.realName}}</span>: {{reply.content}}</p>
                <p v-else><span class="favor-name" @click.stop="toUserInfo(reply.reviewer.userId)">{{reply.reviewer.realName}}</span>: {{reply.content}}</p>
              </p>
            </template>
          </div>
          <div class="reply" v-if="item.commentTotal > 3">
            <span class="favor-name">查看全部{{item.commentTotal}}条回复</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import "style.less";
</style>

<script>
  import index from './main.js'
  export default index
</script>
