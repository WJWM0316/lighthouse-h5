/**
 * 消息
 */
const routers = [
  {
    path: '/message',
    name: 'message',
    component: resolve => require(['@/views/message/index'], resolve),
  },
]

export default routers
