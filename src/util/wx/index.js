import brower from '@/util/browser/index'
import router from '@/router/index'
class WxUtil {
  // ios微信内核的一个坑，分享的路径还是入口地址。这里用刷新当前页刷新处理。
  reloadPage () {
    const iosWX = brower.isWechat() && brower.isIos()
    const {name, params, query} = router.app._route
    if (!(query && query.reload) && iosWX) {
      // 用window.location.href跳转刷新，会导致多一个页面，要返回两次。（所以不用它）
      router.replace({name, params, query: {...query, reload: true}}) // 改变路由
      router.go(0) // 刷新当前页
    }
  }

  /**
   * 检测当前url（location.href）是否在#号前带有?号，没有的话跳转至‘正确路径’
   * => ios上支付调用页面为第一次进入单页面的链接，而安卓则是当前链接
   */
  fixedUrl () {
    const paths = location.href.split('#')
    if (paths[0].charAt(paths[0].length - 1) !== '?') {
      paths[0] = `${paths[0]}?`
    }

    const url = `${paths[0]}#${paths[1]}`
    if (location.href !== url) {
      location.href = url
    }
  }
}

export default new WxUtil()
