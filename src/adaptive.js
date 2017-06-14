(function (win) {

  var dpr = 0, scale = 0, bodyFontSize = 12, adap = {}, doc = win.document
  var htmlEle = doc.documentElement,
      viewportEle = doc.querySelector('meta[name="viewport"]')

  var refresh = function () {
    var docWidth = htmlEle.clientWidth
    if (docWidth / dpr > 540) {
      docWidth = 540 * dpr
    }

    rootFontSize = docWidth / dpr

    htmlEle.style.fontSize = rootFontSize + 'px'
  }

  // 如果已经存在viewport meta标签，则不动态改变
  if (viewportEle) {
    var matchArray = viewportEle.getAttribute('content').match(/initial-scale=([\d\.]+)/)
    scale = matchArray[1]
    dpr   = parseInt(1 / scale)
  }

  // 如果没有设置initial-scale则动态计算出dpr和scale
  if (dpr === 0 && scale === 0) {
    var devicePixelRatio = win.devicePixelRatio

    //判断各种手机的情况
    var iphone = win.navigator.appVersion.match(/iphone/gi)
    var android = win.navigator.appVersion.match(/android/gi)

    if (iphone) {
      if (devicePixelRatio >= 3) {
        dpr = 3
      } else if (devicePixelRatio >= 2) {
        dpr = 2
      } else {
        dpr = 1
      }
    } else if (android) {
      dpr = 1
    } else {
      console.warn('你用的是啥手机啊～_～...')
    }

    // 设置缩放值
    scale = (1 / dpr).toFixed(6)

  }

  htmlEle.setAttribute('data-dpr',dpr)
  if (!viewportEle) {
    var meta = document.createElement('meta')
    meta.setAttribute('name','viewport')
    meta.setAttribute('content','initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
    if (htmlEle.firstElementChild) {
      htmlEle.firstElementChild.appendChild(meta)
    } else {
      console.warn('这个页面没有内容吖...')
    }
  }

  // 文档加载成功设置body字体
  if (win.document.readyState === 'complete') {
    win.document.body.style.fontSize = bodyFontSize + 'px'
  } else {
    win.document.addEventListener('DOMContentLoaded', function(e) {
      win.document.body.style.fontSize = bodyFontSize * dpr + 'px'
    }, false)
  }


})(window)