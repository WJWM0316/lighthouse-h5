/**
 * 我的
 */
const routers = [
  {
    path: '/center',
    name: 'center',
    component: resolve => require(['@/views/center/index'], resolve),
  },
]

export default routers
