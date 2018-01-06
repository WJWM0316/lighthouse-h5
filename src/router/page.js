/**
 * 页面模块
 */
const routers = [
  {
    // 大咖介绍页
    path: '/introduce',
    name: 'introduce',
    component: resolve => require(['@/views/introduce/index'], resolve),
  },
  {
    // 朋友圈、帖子、问题 详情页
    path: '/details/:sourceId/:type',
    name: 'all-details',
    component: resolve => require(['@/views/introduce/details'], resolve),
  },
]

export default routers
