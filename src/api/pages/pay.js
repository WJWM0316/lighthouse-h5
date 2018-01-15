import {request} from '../require.js'

// 支付接口
export const payApi = (data) => {
  return request({
    url: '/wap/pay/JsApiPay',
    data
  })
}
