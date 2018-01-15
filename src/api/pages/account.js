// 登录，注册
import {request} from '../require.js'

// 注册
export const registerApi = (data) => {
  return request({
    url: '/register',
    data
  })
}

// 登录
export const loginApi = (data) => {
  return request({
    url: '/login',
    data
  })
}

// 是否登录
export const isLoginApi = (data) => { // 用户未登录不会返回401，而是isLogin:false
  return request({
    url: '/isLogin',
    data
  })
}

// sms
export const smsApi = (data) => {
  return request({
    url: '/wap/sms',
    data
  })
}

// 完善资料
export const compeleApi = (data) => {
  return request({
    url: '/user/perfect',
    data
  })
}
