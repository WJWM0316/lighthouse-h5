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
    meta: {musicStripBottom: 94}
  },
  {
    path: '/undefined',
    name: 'undefined',
    component: resolve => require(['@/views/abnormal/notFound'], resolve),
    meta: {navHide: true, musicStripHide: true}
  },
  {
    path: '/404',
    name: '404',
    component: resolve => require(['@/views/abnormal/404'], resolve),
    meta: {navHide: true, musicStripHide: true}
  },
  {
    path: '/offline',
    name: 'offline',
    component: resolve => require(['@/views/abnormal/offline'], resolve),
    meta: {navHide: true, musicStripHide: true}
  }
]

export default homeRoutes
