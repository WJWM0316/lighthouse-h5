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
]

export default routers
