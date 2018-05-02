import { request } from '../require'

/**
 * 发布内容
 * @param {*} data
 */
export const publishApi = data => request({
  url: '/wap/beacon/publish',
  isLoading: false,
  data
})

//普通用户发布内容
export const publishPostApi = data => request({
  url: '/wap/beacon/publishPost',
  isLoading: false,
  data
})

