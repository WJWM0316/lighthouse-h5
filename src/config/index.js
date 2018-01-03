const settings = {
// 全局设置
  host: process.env.NODE_ENV !== 'production' ? '/zike_wap' : '/zikeserver', // 接口根地址。线上使用的是Nginx代理
  dbPrefix: 'zike_wap_', // 本地存储的key
  productUrl: 'http://www.ziwork.com',
  devUrl: 'http://demo2016.thetiger.com.cn',
  // 自客服务
  urlSetting: `${window.location.origin}/Wap/Personal/setting.html`,
  // 服务协议
  urlProtocol: `${window.location.origin}/Wap/Personal/setting.html#setting-protocol`,
  // 自客下载
  urlDown: `${window.location.origin}/Wap/Index/download.html`,
  // 用户未完善信息
  urlAuth: `${window.location.origin}/Wap/Personal/ziworkAuth.html`,
  // 用户已完善信息
  urlComplete: `${window.location.origin}/Wap/Ziwork/detail/key/`,
  // 服务列表
  urlService: `${window.location.origin}/Wap/Ziwork/lists.html`
}

export default settings
