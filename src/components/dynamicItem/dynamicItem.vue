<template>
  <!-- 朋友圈动态列表项 -->
  <div class="dynamic-item" @click="toDetails">

    <!-- 头像 -->
    <div class="left">
      <img :src="item.releaseUser.avatar" class="user-image" @click.stop="toUserInfo(item.releaseUser.userId)" />
    </div>

    <div :class="{right: true, border: !hideBorder}">
      <!-- 用户名 -->
      <div class="user-masage">
      	<p class="user-name" :class="role && role.title === '塔主' || role.title === '嘉宾' ? 'master' : 'guest'" @click.stop="toUserInfo(item.releaseUser.userId)">{{item.releaseUser.realName}}<span class="administrators" v-if="role && role.title === '管理员'">管理员</span></p>
      	<span class="user-intro" v-if="role && role.isShow && item.releaseUser && item.releaseUser.career" v-text="item.releaseUser.career"></span>
      </div>
      <!--头衔-->
      <!--<span class="user-career singleLine" v-if="item.releaseUser && item.releaseUser.career" v-text="item.releaseUser.career"></span>-->
			<!--<span class="user-intro" v-if="item.releaseUser && item.releaseUser.career" v-text="item.releaseUser.career">1231324654</span>-->

		</div>
      <!-- 内容区分 -->
      <!-- -------------------------------------------------------------- -->
		<div :class="{right: true, border: !hideBorder}">
      <!-- 问答类型 -->
      <!-- 发表内容 -->
      <!--<div class="publish-content problem" v-if="item.modelType == 'post'">-->
      <div class="publish-content problem" v-if="item.modelType === 'problem'">

        <p class="content-text" :class="{'ellipsis' : isFold}">问：{{item.content}}</p>
        <p class="full-text-btn" v-if="isFold">{{isFullText('circle-content')}}</p>
        <div v-for="problemItem, problemIndex in item.answers" :key="problemIndex">
          <!-- 追问 -->
          <div class="content-problem" v-if="problemItem.answerType === 1">
            <p>追问: {{problemItem.content}}</p>
          </div>
          <!-- 回答 -->
          <div class="content-problem" v-else>
            <img class="user-image" :src="problemItem.releaseUser.avatar" />
            <!-- 纯文本 -->
            <p v-if="problemItem.type === 1">{{problemItem.content}}</p>
            <!-- 音频 -->
            <div v-else :class="{'content-audio': true, 'not-played': !problemItem.file.isPlayed}" @click.stop="audioPlay(problemIndex)">
              <div class="progress-container">
                <div class="progress" :style="{width: (problemItem.progress ? problemItem.progress : 0) + '%'}"></div>
              </div>
              <div class="audio-controller-container">
                <div class="audio-controller">
                  <div :class="{play: !problemItem.musicState, playing: problemItem.musicState === 1, loading: problemItem.musicState === 2}">
                    <img class="icon-play" src="./../../assets/icon/music_play.png">
                    <img class="icon-loading rotateZ" src="./../../assets/icon/music_loading.png">
                    <img class="icon-playing" src="./../../assets/icon/music_listen.gif">
                  </div>
                  <span class="duration">{{problemItem.file.duration}}s</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 帖子类型 -->
      <!-- 发表内容 类型:0.无文件 1.音频 2.视频 3.图片 4.文件 -->
      <div class="publish-content" v-else>

        <!-- 只有文字 -->
        <!--<p class="content-text" v-if="item.circleType === 0">{{item.content}}</p>-->
        <!--限制六行-->
        <div ref="circle-content" v-if="item.circleType === 0">
          <p class="content-text" :class="{'ellipsis' : isFold}">{{item.content}}</p>
          <p class="full-text-btn" v-if="isFold">{{isFullText('circle-content')}}</p>
        </div>

        <!-- 音频 -->
        <div v-if="item.circleType === 1" :class="{'content-audio': true, 'not-played': !item.files[0].isPlayed}" @click.stop="audioPlay()">
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

        <!-- 文字与视频 -->
        <div v-if="item.circleType === 2">
          <!--<p class="content-text">{{item.content}}</p>-->
          <!--限制文本行数-->
          <div ref="circle-content">
	          <p class="content-text" :class="{'ellipsis' : isFold}">{{item.content}}</p>
	          <p class="full-text-btn" v-if="isFold">{{isFullText('circle-content')}}</p>
	        </div>
	        
          <div class="content-video" @click.stop="videoClick">
            <video controls v-show="item.videoPlay" ref="video"></video>
            <div class="placeholder" v-show="!item.videoPlay">

              <!--背景图-->
              <!--<img />-->
            </div>
          </div>
        </div>

        <!-- 文字与图片 -->
        <div v-if="item.circleType === 3">
          <!--<p class="content-text">{{item.content}}</p>-->
          <!--限制文本行数-->
          <div ref="circle-content">
	          <p class="content-text" :class="{'ellipsis' : isFold}">{{item.content}}</p>
	          <p class="full-text-btn" v-if="isFold">{{isFullText('circle-content')}}</p>
	        </div>
	        
          <div class="content-images">
            <!-- 图片为 1 张时 -->
            <div class="item-image one" v-if="item.files.length === 1">
              <img :src="item.files[0].fileUrl || '../../assets/icon/img_head_default.png'" @click.stop="previewImage(item.files[0].fileUrl)" />
            </div>

            <!--  图片为 多 张时  -->
            <div class="item-image" v-for="file in picList" v-else>
              <img :src="file.fileUrl || '../../assets/icon/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.fileUrl)" />
            </div>
          </div>
        </div>

        <!-- 只有文件 -->
        <div v-if="item.circleType === 4">
          <p class="content-text">{{item.content}}</p>
          <div class="content-file" @click.stop="fileOpen(item.files[0].fileUrl)">
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
            {{item.favorTotal > 0 ? item.favorTotal : ''}}
          </button>
          <!-- 评论按钮 -->
          <button v-if="!hideCommentBtn" @click.stop="comment">
            <span class="icon-pinglun">
            	<img src="./../../assets/icon/tab_massage2 copy 2@3x.png" />
            </span>
            {{item.commentTotal > 0 ? item.commentTotal : ''}}
          </button>
          <!-- 灯塔信息 -->
          <div class="info-light-house" v-if="showLightHouseInfo" @click.stop="toCommunity(item.LighthouseId)">
            <span>{{item.Lighthouse}}</span>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comment-area" v-if="!hideCommentArea && (item.favorTotal > 0 || (item.commentTotal > 0 && item.comments && item.comments.length > 0))">
        <!-- 点赞信息 -->
          <div class="praise-block" v-if="item.favorTotal > 0">
            <img class="icon-zan" src="./../../assets/icon/zan2@3x.png" />
            <div class="praise-name">
                <span class="favor-name" v-for="(favor, favorIndex) in item.favors" @click.stop="toUserInfo(favor.userId)">{{favorIndex < 1 ? favor.realName : ',' + favor.realName}}</span>
            </div>
            <span class="praise-total" v-if="item.favorTotal > 3">等{{item.favorTotal}}人觉得很赞</span>
          </div>

        <!-- 评论信息 -->

        <div class="reply-block" v-if="item.commentTotal > 0 && item.comments && item.comments.length > 0">
          <template  v-if="isNeedHot">
            <div class="hot-reply">
              <div class="hot-reply-icon">热门评论</div>
              <div class="reply" v-for="(reply,index) in item.comments">
                <p class="favor-content ellipsis3"><span class="favor-name">{{reply.reviewer.realName}}：</span>{{reply.content}}</p>
              </div>
            </div>
          </template>
          <tempalte v-else>
            <div class="reply ellipsis3" v-for="reply in item.comments">
              <span class="favor-name" @click.stop="toUserInfo(reply.userId)">{{reply.reviewer.realName}}</span>: {{reply.content}}
            </div>
            <div class="reply" v-if="item.commentTotal > 3">
              <span class="favor-name">查看全部{{item.commentTotal}}条回复</span>
            </div>
          </tempalte>
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
