// 消息接口

import { request } from '../require'

/**
 * 获取信息列表
 * @param {*} data
 */
export const messageListApi = data => request({
  url: '/wx/my/messageList',
  data
})
