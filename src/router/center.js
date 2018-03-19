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
  { // 学员列表
    path: '/center/classmates',
    name: 'center-classmates',
    component: resolve => require(['@/views/center/classmatesList'], resolve),
    meta: {navHide: true}
  },
  { // 创建灯塔
    path: '/center/createLite',
    name: 'center-create-lite',
    component: resolve => require(['@/views/center/createLite'], resolve),
    meta: {navHide: true}
  },
  { // 塔主中心
    path: '/center/liteCenter',
    name: 'center-lite-center',
    component: resolve => require(['@/views/center/liteCenter'], resolve),
    meta: {navHide: true}
  },
  { // 塔主分享图片
    path: '/center/shareLite/:communityId',
    name: 'center-share-lite',
    component: resolve => require(['@/views/center/shareLite'], resolve),
    meta: {navHide: true}
  },
  { // 现金奖励
    path: '/center/rewards',
    name: 'center-reward-records',
    component: resolve => require(['@/views/center/rewardRecords'], resolve),
    meta: {navHide: true}
  },
]

export default routers
