/**
 * 我的
 */
const routers = [
  {
    path: '/center',
    name: 'center',
    component: resolve => require(['@/views/center/index'], resolve)
  },
  {
    path: '/center/editinfo',
    name: 'center-editinfo',
    component: resolve => require(['@/views/center/editinfo'], resolve),
    meta: {navHide: true}
  },
  {
    path: '/center/help',
    name: 'center-help',
    component: resolve => require(['@/views/center/help'], resolve),
    meta: {navHide: true}
  },
  {
    path: '/center/protocol',
    name: 'center-protocol',
    component: resolve => require(['@/views/center/protocol'], resolve),
    meta: {navHide: true}
  },
  {
    path: '/center/classmates',
    name: 'center-classmates',
    component: resolve => require(['@/views/center/classmatesList'], resolve),
    meta: {navHide: true}
  }
]

export default routers
