import { request } from '../require'

// ******************* 精选 Tab **********************
/**
 * 首页精选列表内容
 * @param {*} data
 */
export const getBeaconsApi = data => request({
  type: 'get',
  url: '/wap/beacon',
  needUserInfo: false,
  data
})

/**
 * 首页 banner 项
 * @param {*} data
 */
export const getBannersApi = data => request({
  url: '/wap/beacon/banners',
  needUserInfo: false,
  data
})

/**
 * 首页标签项
 * @param {*} data
 */
export const getTagsListApi = data => request({
  url: '/wap/beacon/tags',
  needUserInfo: false,
  data
})

// ******************* 发现 Tab **********************
/**
 * 首页发现列表内容
 * @param {*} data
 */
export const getSelectionApi = data => request({
  url: '/wap/beacon/selection',
  needUserInfo: false,
  data
})
/**
 * 发现列表内容详情项
 * @param {*} data
 */
export const getSelectionDetailsApi = data => request({
  url: '/wap/beacon/selectionDetails',
  needUserInfo: false,
  data
})

// ******************* 已加入 Tab **********************

/**
 * 首页已加入列表
 * @param {*} data
 */
export const getJoineListdApi = data => request({
  url: '/wap/beacon/joined',
  data
})
