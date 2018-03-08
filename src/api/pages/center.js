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

/**
 * 获取申请创建社区详情
 * @param {*} data
 */
export const getApplyCommunityApi = data => request({
  url: '/wap/my/getApplyCommunity',
  data
})

/**
 * 提交申请创建社区
 * @param {*} data
 */
export const saveApplyCommunityApi = data => request({
  url: '/wap/my/setApplyCommunity',
  data
})

/**
 * 获取灯塔中心我的社区列表
 * @param {*} data
 */
export const getMyCommunityListApi = data => request({
  url: '/wap/my/myCommunity',
  data
})
