// 个人中心模块

import { request } from '../require'

/**
 * 获取个人信息
 * @param {*} data
 */
export const getInformationApi = data => request({
  url: '/wap/my/getInformation',
  data
})

/**
 * 保存编辑个人信息
 * @param {*} data
 */
export const editInformationApi = data => request({
  url: '/wap/my/editInformation',
  data
})
