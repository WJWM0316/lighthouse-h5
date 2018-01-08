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
    // 大咖精选页
    path: '/introduce/:communityId/community',
    name: 'community',
    meta: {navHide: true},
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
    // 评论详情页
    path: '/publish/:communityId',
    name: 'publish-content',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/publish'], resolve),
  }
]

export default routers
