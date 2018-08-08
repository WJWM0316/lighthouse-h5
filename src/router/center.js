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
    meta: {navHide: true, hideController:true}
  },
  {
    path: '/center/help',
    name: 'center-help',
    component: resolve => require(['@/views/center/help'], resolve),
    meta: {navHide: true, hideController:true}
  },
  {
    path: '/center/jicall',
    name: 'center-jicall',
    component: resolve => require(['@/views/center/jicall'], resolve),
    meta: {navHide: true, hideController:true}
  },
  {
    path: '/center/protocol',
    name: 'center-protocol',
    component: resolve => require(['@/views/center/protocol'], resolve),
    meta: {navHide: true, hideController:true}
  },
  {
    path: '/center/protocolCreate',
    name: 'center-protocol-create',
    component: resolve => require(['@/views/center/protocol-create'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 学员列表
    path: '/center/classmates/:communityId/:type?',
    name: 'center-classmates',
    component: resolve => require(['@/views/center/classmatesList'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 创建灯塔
    path: '/center/createLite',
    name: 'center-create-lite',
    component: resolve => require(['@/views/center/createLite'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 塔主中心
    path: '/center/liteCenter',
    name: 'center-lite-center',
    component: resolve => require(['@/views/center/liteCenter'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 塔主分享图片
    path: '/center/shareLite/:communityId',
    name: 'center-share-lite',
    component: resolve => require(['@/views/center/shareLite'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 现金奖励
    path: '/center/rewards',
    name: 'center-reward-records',
    component: resolve => require(['@/views/center/rewardRecords'], resolve),
    meta: {navHide: true, hideController:true}
  },
   { // 优惠券
    path: '/center/coupon',
    name: 'center-coupon-page',
    component: resolve => require(['@/views/center/coupon'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 不可使用优惠券
    path: '/center/invalidCoupon',
    name: 'center-coupon-invalidCoupon-page',
    component: resolve => require(['@/views/center/invalidCoupon'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 小灯塔合作协议-个体导师版
    path: '/center/personalProtocol',
    name: 'center-personalProtocol',
    component: resolve => require(['@/views/center/personalProtocol'], resolve),
    meta: {navHide: true, hideController:true}
  },
  { // 小灯塔合作协议-机构导师版
    path: '/center/mechanismProtocol',
    name: 'center-mechanismProtocol',
    component: resolve => require(['@/views/center/mechanismProtocol'], resolve),
    meta: {navHide: true, hideController:true}
  },
]

export default routers
