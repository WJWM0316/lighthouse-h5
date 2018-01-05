/**
 * 申请交换微信
 * 'pages/exchange/list', // 申请列表
 'pages/exchange/apply', // 发起申请
 'pages/exchange/detail', // 申请详情
 */
const routes = [
  {
    path: '/exchange',
    redirect: to => {
      return '/exchange/list'
    }
  },
  {
    path: '/exchange/list',
    name: 'exchange-list',
    component: resolve => require(['@/views/exchange/list'], resolve),
    meta: {navHide: true}
  },
  {
    path: '/exchange/detail',
    name: 'exchange-detail',
    component: resolve => require(['@/views/exchange/detail'], resolve),
    meta: {navHide: true}
  },
  {
    path: '/exchange/apply',
    name: 'exchange-apply',
    component: resolve => require(['@/views/exchange/apply'], resolve),
    meta: {navHide: true}
  }
]

export default routes
