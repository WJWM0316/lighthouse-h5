import { request } from '../require'

/**
 * 发布内容
 * @param {*} data
 */
export const publishApi = data => request({
  url: '/wx/beacon/publish',
  isLoading: false,
  data
})
