import {request} from '../../api/require.js'

export const weixinApi = (data) => {
  return request({
    url: '/weixin/customShare',
    data
  })
}
