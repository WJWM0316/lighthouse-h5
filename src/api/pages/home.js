import { request } from '../require'

/**
 * 获取首页大咖列表
 * @param {*} data
 */
export const getBeaconsApi = data => request({
  method: 'get',
  url: '/wap/beacon',
  needUserInfo: false,
  data
})
