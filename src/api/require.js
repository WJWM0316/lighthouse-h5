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
  // 正常r请
  // let datas = type === 'get' ? {params: data} :data
  let globalLoading = true
  if (data.globalLoading !== undefined) {
    globalLoading = data.globalLoading
    delete data.globalLoading
  }
  data.TestUid = 2
  showLoading(globalLoading)
  let datas = type === 'get' ? {params: {...data}} : {...data}
  return Vue.axios[type](url, datas, config)
    .catch(response => {
      /* eslint-disable prefer-promise-reject-errors */
      return Promise.reject({code: 500, message: '网络异常'})
    })
    .then((response) => {
      let {data} = response
      // console.log('请求接口路径', url)
      // console.log('接口请求参数', datas)
      // console.log('接口返回数据', data)
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
        const hashParams = location.hash.substring(1)
        const hostname = location.href.split('?')[0]
        console.log('hashParams:', hashParams)
        console.log('hostname:', hostname)
        location.href = `${settings.serverUrl}/wap/wechat/callback?zike_from=${hostname}&key=${hashParams}`
        return data.data === undefined ? {} : data.data
      }
      if (data && data.statusCode === 426) { // 没有登录权限,跳去手机号登录
        store.dispatch('remove_userinfo')
        hideLoading(globalLoading)
        router.replace({
          name: 'login',
          query: {redirect: location.href}
        })
      }
      if (data && data.statusCode === 433) { // 支付接口没有登录权限,跳去手机号登录
        store.dispatch('remove_userinfo')
        hideLoading(globalLoading)
        if (location.href.endsWith('reload=true') || location.href.indexOf('saleId=') > -1) {
          router.replace({
            name: 'login',
            query: {redirect: encodeURI(location.href + '&autoPay=true')}
          })
        } else {
          router.replace({
            name: 'login',
            query: {redirect: encodeURI(location.href + '?autoPay=true')}
          })
        }
      }
      if (data && data.statusCode === 430) {
        router.replace({
          name: 'center-editinfo',
          query: {redirect: router.currentRoute.path}
        })
      }
      if (data && data.statusCode === 431) { // 需要授权
        hideLoading(globalLoading)
        const hashParams = location.hash.substring(1)
        const hostname = location.href.split('?')[0]
        location.href = encodeURI(`${settings.serverUrl}/wap/wechat/snsapiUserinfo?zike_from=${hostname}&key=${hashParams}`)
        return data.data === undefined ? {} : data.data
      }
      if (data && data.statusCode === 432) { // 需要授权
        hideLoading(globalLoading)
        var hashParams = location.hash.substring(1)
        console.log('xxxx', hashParams, hashParams.endsWith('reload=true'))
        if (hashParams.endsWith('reload=true')) {
          hashParams = hashParams + '&autoPay=true'
        } else {
          hashParams = hashParams + '?autoPay=true'
        }
        const hostname = location.href.split('?')[0]
        location.href = encodeURI(`${settings.serverUrl}/wap/wechat/snsapiUserinfo?zike_from=${hostname}&key=${hashParams}`)
        return data.data === undefined ? {} : data.data
      }
      if (data && data.statusCode === 264) { // 内容找不到
        hideLoading(globalLoading)
        router.replace({
          name: 'undefined'
        })
      }
      if (data && data.statusCode === 271) { // 未入社进入社后请求报的错 跳转到入社介绍页 需要一个社区id
        hideLoading(globalLoading)
        if (data.data) {
          router.replace(`/introduce/${data.data.communityId}`)
        } else {
          router.replace(`/index`)
        }
        return {}
      }

      hideLoading(globalLoading)
      return Promise.reject(data)
    })
    .catch(err => {
      hideLoading(globalLoading)
      return Promise.reject(err)
    })
}
