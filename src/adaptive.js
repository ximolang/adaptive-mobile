(function (win) {

  var dpr = 0, scale = 0, devicePixelRatio = 1, bodyFontSize = 12, timer = null, doc = win.document
  var htmlEle = doc.documentElement,
    viewportEle = doc.querySelector('meta[name="viewport"]')

  var calcDprAndScale = function () {
    devicePixelRatio = win.devicePixelRatio
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
    } else {
      dpr = 1
    }

    // 设置缩放值
    scale = (1 / dpr).toFixed(6)
  }

  var refresh = function () {
    var docWidth = htmlEle.clientWidth, rootFontSize

    calcDprAndScale()

    if (docWidth / dpr > 540) {
      docWidth = 540 * dpr
    }

    htmlEle.setAttribute('data-dpr', dpr)

    rootFontSize = docWidth / 10

    htmlEle.style.fontSize = rootFontSize + 'px'
    if (doc.body) doc.body.style.fontSize = bodyFontSize * dpr + 'px'
  }

  // 如果已经存在viewport meta标签，则不动态改变
  if (viewportEle) {
    var matchArray = viewportEle.getAttribute('content').match(/initial-scale=([\d\.]+)/)
    scale = matchArray[1]
    dpr = parseInt(1 / scale)
  }

  // 如果没有设置initial-scale则动态计算出dpr和scale
  if (dpr === 0 && scale === 0) {
    calcDprAndScale()
  }

  htmlEle.setAttribute('data-dpr', dpr)

  if (!viewportEle) {
    var meta = document.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
    if (htmlEle.firstElementChild) {
      htmlEle.firstElementChild.appendChild(meta)
    } else {
      console.warn('这个页面没有内容吖...')
    }
  }

  // 文档加载成功设置body字体
  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = bodyFontSize * dpr + 'px'
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      doc.body.style.fontSize = bodyFontSize * dpr + 'px'
    }, false)
  }

  refresh()

  win.addEventListener('resize', function () {
    clearTimeout(timer)
    timer = setTimeout(refresh, 300)
  }, false)

  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      clearTimeout(timer);
      timer = setTimeout(refresh, 300);
    }
  }, false);

})(window)