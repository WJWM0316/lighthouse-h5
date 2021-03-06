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
    path: '/teacherActivity',
    name: 'teacherActivity',
    meta: {navHide: true},
    component: resolve => require(['@/views/activity/teacher/teacherActivity'], resolve),
  },
  {
    path: '/trainCamp',
    name: 'trainCamp',
    meta: {navHide: true},
    component: resolve => require(['@/views/activity/trainCamp/trainCamp'], resolve),
  },
  {
    path: '/active_11',
    name: 'active_11',
    meta: {navHide: true},
    component: resolve => require(['@/views/activity/active_11/active_11'], resolve),
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
    component: resolve => require(['@/views/home/joined'], resolve),
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
    meta: {navHide: true, hideController:true}
  },
  {
    path: '/404',
    name: '404',
    component: resolve => require(['@/views/abnormal/404'], resolve),
    meta: {navHide: true, hideController:true}
  },
  {
    path: '/offline',
    name: 'offline',
    component: resolve => require(['@/views/abnormal/offline'], resolve),
    meta: {navHide: true, hideController:true}
  },
  {
    path: '/campList',
    name: 'campList',
    component: resolve => require(['@/views/home/campList'], resolve),
    meta: {navHide: true}
  }
]

export default homeRoutes
