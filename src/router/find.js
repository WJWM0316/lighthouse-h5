/**
 * 发现
 */
const routers = [
  {
    path: '/find',
    name: 'find',
    component: resolve => require(['@/views/find/index'], resolve),
  },
]

export default routers
