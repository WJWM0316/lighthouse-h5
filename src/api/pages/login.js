import {request} from '../require.js'

// 注册
export const testApi = (data) => {
  return request({
    url: '/test',
    data
  })
}

// 登录
export const loginApi = (data) => {
  return request({
    url: '/wx/login',
    data
  })
}
// 用户允许授权后需返回数据给该接口
export const grantInformationApi = (data) => {
  console.log(data)
  return request({
    url: '/wx/my/grantInformation',
    data,
    isLoading: false
  })
}
// code 给后端去换session_key
export const getSessionKeyApi = (data) => {
  return request({
    url: '/wx/my/getSessionKey',
    data,
    isLoading: false
  })
}
// 是否绑定手机
export const isBindPhoneApi = (data) => {
  return request({
    url: '/wx/my/isBindPhone',
    data
  })
}
// 获取短信验
export const smsApi = (data) => {
  return request({
    url: '/wx/sms',
    data
  })
}

// 获取短信验
export const getCodeImg = (data) => {
  return request({
    url: '/wx/captchas',
    data
  })
}
