import { request } from '../require'

/**
 * 获取大咖问题列表
 * @param {*} data
 */
export const getProblemListApi = data => request({
  url: '/wx/problem/getMasterInfo',
  data
})

/**
 * 获取大咖问题详情
 * @param {*} data
 */
export const getProblemInfoApi = data => request({
  url: '/wx/problem/getMasterProblemInfo',
  data
})

/**
 * 大咖回答问题
 * @param {*} data
 */
export const replyApi = data => request({
  url: '/wx/problem/getMasterAnswer',
  data
})
