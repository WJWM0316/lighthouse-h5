import {request} from '../require.js'

// 支付接口
export const payApi = (data) => {
  return request({
    url: '/wap/pay/JsApiPay',
    data
  })
}

// 免费支付接口
export const freePay = (data) => {
  return request({
    url: '/wap/pay/freePay',
    data
  })
}
