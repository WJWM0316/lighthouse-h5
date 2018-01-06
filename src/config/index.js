const settings = {
// 全局设置
  host: process.env.NODE_ENV !== 'production' ? '/lighthouse_wap' : '/zikeserver', // 接口根地址。线上使用的是Nginx代理
  dbPrefix: 'lighthourse_wap_', // 本地存储的key
  productUrl: 'https://light.house.api.ziwork.com',
  devUrl: 'https://light.house.api.ziwork.com',
  // // 自客服务
  // urlSetting: `${window.location.origin}/Wap/Personal/setting.html`,
  // // 服务协议
  // urlProtocol: `${window.location.origin}/Wap/Personal/setting.html#setting-protocol`,
  // urlService: `${window.location.origin}/Wap/Ziwork/lists.html`
}

export default settings
