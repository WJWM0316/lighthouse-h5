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
    // 大咖介绍页v2
    path: '/introduce2/:communityId',
    name: 'introduce2',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/index_v2'], resolve),
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
    //path: '/more/:sourceId/:type',
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
    // 大咖精选页
    path: '/introduce2/:communityId/community',
    name: 'community2',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/community_v2'], resolve),
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
    meta: {navHide: true, hideController:true},
    component: resolve => require(['@/views/introduce/publish'], resolve),
  },
  {
    // 发布语音
    path: '/publishVoice/:communityId',
    name: 'publish-voice',
    meta: {navHide: true, hideController:true, stopMusic: true},
    component: resolve => require(['@/views/introduce/publishVoice'], resolve),
  },
  {
    // 同学列表
    path: '/classmates/:communityId',
    name: 'classmates',
    meta: {navHide: true, hideController:true},
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
    meta: {navHide: true, hideController:true},
    component: resolve => require(['@/views/introduce/ask'], resolve),
  },
  {
    // 大咖问题列表
    path: '/introduce/questions/:communityId',
    name: 'questions',
    meta: {navHide: true, hideController:true},
    component: resolve => require(['@/views/introduce/questions'], resolve),
  },
  {
    // 大咖问题详情
    path: '/introduce/replyQuestion/:communityId/:problemId',
    name: 'question-reply',
    meta: {navHide: true, stopMusic: true, hideController:true},
    component: resolve => require(['@/views/introduce/replyQuestion'], resolve),
  },
  {
    // 社区分销排行榜
    path: '/introduce/ranking/:communityId',
    name: 'distribution-rankings',
    meta: {navHide: true, hideController:true},
    component: resolve => require(['@/views/other/distributionRankings'], resolve),
  },
  {
    // 高考活动
    path: '/examination',
    name: 'gaokao',
    meta: {navHide: true, hideController:true},
    component: resolve => require(['@/views/activity/gaokao'], resolve),
  },
	{
    // 优惠券
    path: '/coupon',
    name: 'coupon',
    meta: {navHide: true, hideController:true},
    component: resolve => require(['@/views/activity/coupon'], resolve),
	},
	{
    // 点击领取后页面
    path: '/couponResult',
    name: 'couponResult',
    meta: {navHide: true, hideController:true},
    component: resolve => require(['@/views/activity/coupon/couponResult'], resolve),
	},
	{
    // 课节页面
    path: '/Lesson',
    name: 'Lesson',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/Lesson'], resolve),
	},
	{
    // 打卡编辑页
    path: '/PunchEditing',
    name: 'PunchEditing',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/PunchEditing'], resolve),
	},
	{
    // 打卡内容列表页
    path: '/PunchList',
    name: 'PunchList',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/punchList'], resolve),
	},
	{
    // 打卡详情页
    path: '/PunchDetails',
    name: 'PunchDetails',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/punchDetails'], resolve),
	},
  {
    // 海报图
    path: '/poster',
    name: 'poster',
    meta: {navHide: true},
    component: resolve => require(['@/views/poster/poster'], resolve),
  },
]

export default routers
