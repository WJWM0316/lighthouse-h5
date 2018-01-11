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
/**
 * 显示loading
 * @param {*} open 是否开启loading
 */
function showLoading (open) {
  if (open) {
    Vue.$vux.loading.show({
      text: '加载中...'
    })
  }
}

/**
 * 隐藏loading
 * @param {*} open 是否开启loading
 */
function hideLoading (open) {
  if (open) {
    Vue.$vux.loading.hide()
  }
}

export const request = ({type = 'post', url, data = {}, config = {}} = {}) => {
  console.log('url', url)
  // 正常请
  // let datas = type === 'get' ? {params: data} :data
  let globalLoading = false
  if (data.globalLoading !== undefined) {
    globalLoading = data.globalLoading || false
    delete data.globalLoading
  }
  showLoading(globalLoading)
  let datas = type === 'get' ? {params: {...data, TestUid: 2}} : {...data, TestUid: 2}
  console.log('require params', datas)
  return Vue.axios[type](url, datas, config)
    .catch(response => {
      /* eslint-disable prefer-promise-reject-errors */
      return Promise.reject({code: 500, message: '服务器繁忙!'})
    })
    .then((response) => {
      let {data} = response
      console.log('xxxxxxx', data)
      if (typeof data === 'string') { // 转换返回json
        data = JSON.parse(data)
      }
      if (data && data.statusCode === 200) {
        hideLoading(globalLoading)
        return data.data === undefined ? {} : data.data
      }
      if (data && data.statusCode === 255) { // 登录时openId cookie失效
        store.dispatch('remove_userinfo')
        hideLoading(globalLoading)
        location.href = `/zikeserver/wap/weixin/index?zike_from=${location.href}`
        return data.data === undefined ? {} : data.data
      }
      if (data && data.statusCode === 401) { // 没有登录权限
        store.dispatch('remove_userinfo')
        hideLoading(globalLoading)
        router.replace({
          name: 'login',
          query: {redirect: router.currentRoute.path}
        })
      }
      if (data && data.statusCode === 430) {
        router.replace({
          name: 'center-editinfo',
          query: {redirect: router.currentRoute.path}
        })
      }
      if (data && data.statusCode === 264) { // 内容找不到
        hideLoading(globalLoading)
        router.replace({
          name: 'undefined'
        })
      }
      if (data && data.statusCode === 271) { // 未入社进入社后请求报的错 跳转到入社介绍页 需要一个社区id
        // hideLoading(globalLoading)
        // router.replace({
        //   name: 'undefined'
        // })
      }

      hideLoading(globalLoading)
      return Promise.reject(data)
    })
    .catch(err => {
      hideLoading(globalLoading)
      return Promise.reject(err)
    })
}
