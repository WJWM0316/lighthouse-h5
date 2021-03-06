/**
 * 登录相关
 */
const routers = [
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/views/login/index'], resolve),
    meta: {navHide: true, hideController:true}
  },
]

export default routers
