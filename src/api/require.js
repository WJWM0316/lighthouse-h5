import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import settings from '@/config'
import store from '../store/index.js'
import router from '../router/index.js'
// import localstorage from '@/util/localstorage/index'

Vue.use(VueAxios, axios)
// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = settings.host

export const request = ({type = 'post', url, data = {}, config = {}, globalLoading = false} = {}) => {
  console.log('url', url)
  // 正常请
  // let datas = type === 'get' ? {params: data} :data
  let datas = type === 'get' ? {params: data} : {...data, TestUid: 2}
  console.log('require params', datas)
  return Vue.axios[type](url, datas, config)
    .catch(response => {
      /* eslint-disable prefer-promise-reject-errors */
      return Promise.reject({code: 500, message: '服务器繁忙!'})
    })
    .then((response) => {
      let {data} = response
      if (typeof data === 'string') { // 转换返回json
        data = JSON.parse(data)
      }
      if (data && data.statusCode === 200) {
        return data.data === undefined ? {} : data.data
      }
      if (data && data.statusCode === 255) { // 登录时openId cookie失效
        store.dispatch('remove_userinfo')
        location.href = `/zikeserver/wap/weixin/index?zike_from=${location.href}`
        return data.data === undefined ? {} : data.data
      }
      if (data && data.statusCode === 401) { // 没有登录权限
        store.dispatch('remove_userinfo')
        router.replace({
          name: 'login',
          query: {redirect: router.currentRoute.path}
        })
      }
      if (data && data.statusCode === 264) { // 内容找不到
        router.replace({
          name: 'undefined'
        })
      }
      return Promise.reject(data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}
