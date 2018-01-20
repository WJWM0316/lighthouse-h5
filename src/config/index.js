const settings = {
// 全局设置
  host: process.env.NODE_ENV !== 'production' ? '/lighthouse_wap' : '/beaconserver', // 接口根地址。线上使用的是Nginx代理
  dbPrefix: 'lighthourse_wap_', // 本地存储的key
  serverUrl: process.env.NODE_ENV !== 'production' ? 'http://demo2016.thetiger.com.cn/beaconserver' : '/beaconserver',
  productUrl: 'https://www.zike.com/beaconserver',
  devUrl: 'http://demo2016.thetiger.com.cn/beaconserver',
  // // 自客服务
  // urlSetting: `${window.location.origin}/Wap/Personal/setting.html`,
  // // 服务协议
  // urlProtocol: `${window.location.origin}/Wap/Personal/setting.html#setting-protocol`,
  // urlService: `${window.location.origin}/Wap/Ziwork/lists.html`
}

export default settings
