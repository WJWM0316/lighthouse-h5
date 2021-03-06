import {request} from '../require.js'

// test
export const testApi = (data) => {
  return request({
    url: '/wap/currency/getGeneralList',
    data
  })
}

// 登录
export const loginApi = (data) => {
  return request({
    url: '/wap/login',
    data
  })
}
// 用户允许授权后需返回数据给该接口
export const grantInformationApi = (data) => {
  console.log(data)
  return request({
    url: '/wap/my/grantInformation',
    data,
    isLoading: false
  })
}
// code 给后端去换session_key
export const getSessionKeyApi = (data) => {
  return request({
    url: '/wap/my/getSessionKey',
    data,
    isLoading: false
  })
}
// 是否绑定手机
export const isBindPhoneApi = (data) => {
  return request({
    url: '/wap/my/isBindPhone',
    data
  })
}
// 获取短信验
export const smsApi = (data) => {
  return request({
    url: '/wap/sms',
    data
  })
}

// 获取短信验
export const appSmsApi = (data) => {
  return request({
    url: '/wap/h5/sms',
    data
  })
}

// 获取验证码图片
export const getCodeImg = (data) => {
  return request({
    url: '/wap/captchas',
    data
  })
}

// 获取验证码图片
export const getAppCodeImg = (data) => {
  return request({
    url: '/wap/h5/captchas',
    data
  })
}

// 是否需要跳转手动授权
export const isNeedGrantApi = (data) => {
  return request({
    url: '/wap/user/issetUnionid',
    data
  })
}