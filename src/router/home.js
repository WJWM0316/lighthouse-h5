/**
 * 主页模块
 */
const homeRoutes = [
  {
    path: '/',
    redirect: to => {
      return '/index'
    }
  },
  {
    path: '/index',
    name: 'home',
    component: resolve => require(['@/views/home/index'], resolve),
  },
  {
    path: '/advertising/:type',
    name: 'advertising',
    meta: {navHide: true},
    component: resolve => require(['@/views/home/advertising'], resolve),
  },
  {
    path: '/index/details/:sourceId',
    name: 'find-detail',
    meta: {navHide: true},
    component: resolve => require(['@/views/introduce/exploreDetails'], resolve),
  },
  {
    path: '/joined',
    name: 'joined',
    component: resolve => require(['@/views/home/index'], resolve),
  },
  // {
  //   path: '/find',
  //   name: 'find',
  //   component: resolve => require(['@/views/home/index'], resolve),
  // },
  {
    path: '/undefined',
    name: 'undefined',
    component: resolve => require(['@/views/abnormal/notFound'], resolve),
    meta: {navHide: true}
  },
  {
    path: '/404',
    name: '404',
    component: resolve => require(['@/views/abnormal/404'], resolve),
    meta: {navHide: true}
  },
  {
    path: '/offline',
    name: 'offline',
    component: resolve => require(['@/views/abnormal/offline'], resolve),
    meta: {navHide: true}
  }
]

export default homeRoutes
