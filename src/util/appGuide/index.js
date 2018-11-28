class appGuide {
  /* 调起app或跳转引导页 */
  isToApp (isToGuide) {
    let url = "ttbeacon://app:8080/launcher"
    /* 是否微信环境 */
    if (this.isWeiXin()) {
      if (isToGuide) {
        window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.thetiger.beacon.android"
      } else {
        window.location.href = 'https://www.ziwork.com/beaconstatic/?from=singlemessage#/Guide?id=ttbeacon://app:8080/launcher'
      }
    } else {
      this.toApp()
    }
  }
  
  /* 跳转app */
  toApp () {
    let appUrl = "ttbeacon://app:8080/launcher"
    if(navigator.userAgent.match(/(iPhone|iPod|iPad)/i)){ // ios
      window.location.href = appUrl
      let iframe = document.createElement('iframe');
      let body = document.body;
      iframe.style.cssText='display:none;width=0;height=0'
      body.appendChild(iframe);
      iframe.src = appUrl;
      setTimeout(function() {
        window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.thetiger.beacon.android";
      }, 2000)
    }
    if(navigator.userAgent.match(/android/i)){ // 安卓
      let iframe = document.createElement('iframe');
      let body = document.body;
      iframe.style.cssText='display:none;width=0;height=0'
      body.appendChild(iframe);
      iframe.src = appUrl;
      window.location.href = appUrl
      setTimeout(function() {
        window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.thetiger.beacon.android";//android 下载地址
      }, 2000) 
    }
  }
  
  /* 是否微信 */
  isWeiXin () {
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    let ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      return true;
    }else{
      return false;
    }
  }
  
}

export default new appGuide()
