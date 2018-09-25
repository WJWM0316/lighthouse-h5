// 个人中心模块

import { request } from '../require'


/**
 * 九月活动-行星青年
 * @param {*} data
 */
export const planetYouth = data => request({
  url: '/wap/activity/planetYouth',
  type: 'get',
  data
})

