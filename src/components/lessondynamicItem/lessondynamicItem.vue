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
      	<p class="user-name" @click.stop="toUserInfo(item.releaseUser.userId)">{{item.releaseUser.realName}}</p>
      	<span class="user-intro" v-if="item.releaseUser && item.releaseUser.career" v-text="item.releaseUser.career"></span>
      </div>
      <!--设置是否评委优秀-->
      <div class="evaluate" v-if="item.isMaster ===1" @click.stop="showEvaluate">
      	···
      	<div class="evaluateWindow" v-if="evaluateWindow">
      		<!--<span @click.stop="evaluate('true')">选为优秀打卡</span>
      		<span @click.stop="evaluate('false')">取消优秀打卡</span>-->
      	</div>
      </div>
      <!--头衔-->
      <!--<span class="user-career singleLine" v-if="item.releaseUser && item.releaseUser.career" v-text="item.releaseUser.career"></span>-->
			<!--<span class="user-intro" v-if="item.releaseUser && item.releaseUser.career" v-text="item.releaseUser.career">1231324654</span>-->

		</div>
      <!-- 内容区分 -->
      <!-- -------------------------------------------------------------- -->
		<div :class="{right: true, border: !hideBorder}">

      <!-- 帖子类型 -->
      <!-- 发表内容 类型:0.无文件 1.音频 2.视频 3.图片 4.文件 -->
      <div class="publish-content">

        <!-- 只有文字 -->
        <!--<p class="content-text" v-if="item.circleType === 0">{{item.content}}</p>-->
        <!--限制六行-->
        <div ref="circle-content" v-if="item.cardType === 0">
          <p class="content-text" :class="{'ellipsis' : isFold}">{{item.cardContent}}</p>
          <p class="full-text-btn" v-if="isFold">{{isFullText('circle-content')}}</p>
        </div>

        <!-- 文字与视频 -->
        <div v-if="item.cardType === 2">
          <!--<p class="content-text">{{item.content}}</p>-->
          <!--限制文本行数-->
          <div ref="circle-content">
	          <p class="content-text" :class="{'ellipsis' : isFold}">{{item.cardContent}}</p>
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
        <div v-if="item.cardType === 3">
          <!--<p class="content-text">{{item.content}}</p>-->
          <!--限制文本行数-->
          <div ref="circle-content">
	          <p class="content-text" :class="{'ellipsis' : isFold}">{{item.cardContent}}</p>
	          <p class="full-text-btn" v-if="isFold">{{isFullText('circle-content')}}</p>
	        </div>
	        
          <div class="content-images">
            <!-- 图片为 1 张时 -->
            <div class="item-image one" v-if="item.cardContentFile && item.cardContentFile.length === 1">
              <img :src="item.cardContentFile[0].fileUrl || '~ICON/img_head_default.png'" @click.stop="previewImage(item.cardContentFile[0].fileUrl)" />
            </div>

            <!--  图片为 多 张时  -->
            <div class="item-image" v-for="file in picList" v-else>
              <img :src="file.fileUrl || '~ICON/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.fileUrl)" />
            </div>
          </div>
        </div>
      </div>

      <!-- -------------------------------------------------------------- -->

      <!-- 尾部 -->
      <div class="info-area">
        <div>
          <span>{{timeStr}}</span>
          <span v-if="showDelBtn && item['isSelf']" class="del-btn" @click.stop="del">编辑</span>
        </div>

        <div class="operation">
          <!-- 点赞按钮 -->
          <button @click.stop="praise(item.courseId,item.peopleId)">
            <img v-if="item.isFavor" class="icon-zan" src="~ICON/bnt_zan_pre@3x.png" />
            <img v-else class="icon-zan" src="~ICON/bnt_zan@3x.png" />
            {{item.favorTotal > 0 ? item.favorTotal : ''}}
          </button>
          <!-- 评论按钮 -->
          <button @click.stop="comment">
            <span class="icon-pinglun">
            	<img src="./../../assets/icon/bnt_comment@3x.png" />
            </span>
            {{item.commentTotal > 0 ? item.commentTotal : ''}}
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comment-area" v-if="!hideCommentArea && (item.favorTotal > 0 || (item.commentTotal > 0 && item.commentlist.hotComments && item.commentlist.hotComments.length > 0))">
        <!-- 点赞信息 -->
          <div class="praise-block" v-if="item.favorTotal > 0">
            <img class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
            <div class="praise-name">
                <span class="favor-name" v-for="(favor, favorIndex) in item.favorList" @click.stop="toUserInfo(favor.userId)">{{favorIndex < 1 ? favor.realName : ',' + favor.realName}}</span>
            </div>
            <span class="praise-total" v-if="item.favorTotal > 3">等{{item.favorTotal}}人觉得很赞</span>
          </div>

        <!-- 评论信息 -->

        <div class="reply-block" v-if="item.commentTotal > 0 && item.commentlist.hotComments && item.commentlist.hotComments.length > 0">
          <template>
            <div class="hot-reply">
              <div class="hot-reply-icon">热门评论</div> 
              <div class="reply" v-for="(reply,index) in item.commentlist.hotComments">
                <p class="favor-content ellipsis3"><span class="favor-name">{{reply.reviewer.realName}}：</span>{{reply.content}}</p>
              </div>
            </div>
          </template>
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
