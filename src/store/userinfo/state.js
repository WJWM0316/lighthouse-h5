import localstorage from '@/util/localstorage'

export default {
  // 登录成功后的用户信息
  userinfo: localstorage.get('userinfo') || {},
  firstReading: localstorage.get('first_reading')
}
