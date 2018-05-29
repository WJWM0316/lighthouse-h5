/**
 * 页面模块
 */
const routers = [
  {
    // 大咖介绍页
    path: '/introduce/:communityId',
    name: 'introduce',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/index'], resolve),
  },
  {
    // 大咖详情页 (入社后查看介绍页)
    path: '/introduce/:communityId/detail',
    name: 'introduce-detail',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/index'], resolve),
  },
  {
    // 更多页
    path: '/introduce/:communityId/more',
//	path: '/more/:sourceId/:type',
    name: 'introduce-more',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/more'], resolve),
  },
  {
    // 大咖精选页
    path: '/introduce/:communityId/community',
    name: 'community',
    meta: {navHide: true,keepAlive:true},
    component: resolve => require(['@/views/introduce/community'], resolve),
  },
  {
    // 朋友圈、帖子、问题 详情页
    path: '/details/:sourceId/:type',
    name: 'all-details',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/details'], resolve),
  },
  {
    // 评论详情页
    path: '/reply/:commentId',
    name: 'all-reply',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/replys'], resolve),
  },
  {
    // 发布内容
    path: '/publish/:communityId',
    name: 'publish-content',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/publish'], resolve),
  },
  {
    // 发布语音
    path: '/publishVoice/:communityId',
    name: 'publish-voice',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/publishVoice'], resolve),
  },
  {
    // 同学列表
    path: '/classmates/:communityId',
    name: 'classmates',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/classmates'], resolve),
  },
  {
    // 用户个人详情页
    path: '/userInfo/:userId/details',
    name: 'userInfo-details',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/userInfo'], resolve),
  },
  {
    // 用户提问
    path: '/introduce/ask/:communityId',
    name: 'ask',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/ask'], resolve),
  },
  {
    // 大咖问题列表
    path: '/introduce/questions/:communityId',
    name: 'questions',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/questions'], resolve),
  },
  {
    // 大咖问题详情
    path: '/introduce/replyQuestion/:communityId/:problemId',
    name: 'question-reply',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/replyQuestion'], resolve),
  },
  {
    // 社区分销排行榜
    path: '/introduce/ranking/:communityId',
    name: 'distribution-rankings',
    meta: {navHide: true},
    component: resolve => require(['@/views/other/distributionRankings'], resolve),
  },
  {
    // 拼音测试
    path: '/music',
    name: 'music',
    meta: {navHide: true},
    component: resolve => require(['@/components/media/music'], resolve),
  }
]

export default routers
