<template>
  <!-- 朋友圈动态列表项 -->
  <div class="dynamic-item" @click="toDetails">

    <!-- 头像 -->
    <div class="left">
      <img :src="item.releaseUser.avatar" class="user-image" @click.stop="toUserInfo(item.releaseUser.userId)" />
    </div>

    <div :class="{right: true, border: !hideBorder}">
      <!-- 用户名 -->
      <span class="user-name" @click.stop="toUserInfo(item.releaseUser.userId)">{{item.releaseUser.realName}}</span>

      <!-- 内容区分 -->
      <!-- -------------------------------------------------------------- -->

      <!-- 问答类型 -->
      <!-- 发表内容 -->
      <div v-if="item.modelType === 'problem'" class="publish-content problem"></div>

      <!-- 帖子类型 -->
      <!-- 发表内容 类型:0.无文件 1.音频 2.视频 3.图片 4.文件 -->
      <div v-else class="publish-content">

        <!-- 只有文字 -->
        <p class="content-text" v-if="item.circleType === 0">{{item.content}}</p>

        <!-- 音频 -->
        <div v-if="item.circleType === 1" :class="{'content-audio': true, 'not-played': !item.files[0].isPlayed}">
          <div class="progress-container">
            <div class="progress" style="width: 50%"></div>
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

        <!-- 文字与视频 -->
        <div v-if="item.circleType === 2">
          <p class="content-text">{{item.content}}</p>
          <div class="content-video">
            <!--背景图-->
            <img />
          </div>
        </div>

        <!-- 文字与图片 -->
        <div v-if="item.circleType === 3">
          <p class="content-text">{{item.content}}</p>
          <div class="content-images">
            <!-- 图片为 1 张时 -->
            <div class="item-image one" v-if="item.files.length === 1">
              <img :src="item.files[0].fileUrl || '../../assets/icon/img_head_default.png'" />
            </div>

            <!--  图片为 多 张时  -->
            <div class="item-image" v-for="file in picList" v-else>
              <img :src="file.fileUrl || '../../assets/icon/img_head_default.png'" v-if="!file.holder" />
            </div>
          </div>
        </div>


        <!-- 只有文件 -->
        <div v-if="item.circleType === 4">
          <p class="content-text">{{item.content}}</p>
          <div class="content-file">
            <img class="file-logo" src="./../../assets/suffix/pdf.png" v-if="fileType === 'pdf'" />
            <img class="file-logo" src="./../../assets/suffix/ppt.png" v-else-if="fileType === 'ppt'" />
            <img class="file-logo" src="./../../assets/suffix/word.png" v-else-if="fileType === 'word'" />
            <img class="file-logo" src="./../../assets/suffix/xls.png" v-else-if="fileType === 'xls'" />
            <img class="file-logo" src="" v-else />

            <div class="file-desc">
              <p>{{item.files[0].fileName}}</p>
              <p>{{byteStr}}</p>
            </div>
          </div>
        </div>
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
            <img v-if="item.isFavor" class="icon-zan" src="./../../assets/icon/zan_click.png" />
            <img v-else class="icon-zan" src="./../../assets/icon/zan2@3x.png" />
            {{item.favorTotal > 0 ? item.favorTotal : '点赞'}}
          </button>
          <!-- 评论按钮 -->
          <button v-if="!hideCommentBtn" @click.stop="comment">
            <img class="icon-pinglun" src="./../../assets/icon/pinglun2@3x.png" />
            {{item.commentTotal > 0 ? item.commentTotal : '评论'}}
          </button>
          <!-- 灯塔信息 -->
          <div class="info-light-house" v-if="showLightHouseInfo" @click.stop="toCommunity">
            <span>{{item.Lighthouse}}</span>
          </div>
        </div>
      </div>


      <!-- 评论区 -->
        <div class="comment-area" v-if="!hideCommentArea && (item.favorTotal > 0 || item.commentTotal > 0)">
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
            <div class="reply" v-for="reply in item.comments">
              <span class="favor-name" @click.stop="toUserInfo(reply.userId)">{{reply.realName}}</span>: {{reply.content}}
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
