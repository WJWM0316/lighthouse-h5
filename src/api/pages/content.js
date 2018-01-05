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
