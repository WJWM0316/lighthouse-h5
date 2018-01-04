import {request} from '../../api/request.js'

export const weixinApi = (data) => {
  return request({
    url: '/weixin/customShare',
    data
  })
}
