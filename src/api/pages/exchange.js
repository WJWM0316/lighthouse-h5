import { request } from '../require'

/**
 * 获取首页大咖列表
 * @param {*} data
 */
// 申请列表
export const applyListApi = data => request({
  url: '/wx/wechat/applyList',
  data
})

// 获取申请详情
export const applyDetailsApi = data => request({
  url: '/wx/wechat/applyDetails',
  data
})

// 处理别人申请与你交换请求
export const handleDetailsApi = data => request({
  url: '/wx/wechat/handleDetails',
  data
})

// 向别人发起申请
export const surplusApi = data => request({
  url: '/wx/wechat/surplus',
  data
})

// 交换微信
export const exchangeWxApi = data => request({
  url: '/wx/wechat/exchangeWx',
  data
})
