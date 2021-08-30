import $ from 'jquery'

export const initNav = function () {
  $(document).on('ready', async function () {
    let windowHref = ''
    let windowPath = ''
    if (domainType === 'PREFIX') {
      windowPath = window.location.pathname.indexOf('-') !== -1 ? window.location.pathname.split('-')[0] : window.location.pathname
      windowHref = window.location.origin + windowPath
      $(".nav-item>a").each((index, tab) => {
        const h = $(tab).attr('href').replace(/#{0,}/g, '')
        const n = h.slice(-2, -1); //提取导航里的尾部，展示n,p
        const t = windowPath.slice(1, 2); //提取当前url的尾部，展示n,p
        if (h && (h == windowHref || t == n || windowPath.indexOf(h) !== -1)) {
          $(tab).addClass('nav-active')
          //siblings():所有同级a 元素去掉该class。
          $(tab).parent().siblings().find('a').removeClass('nav-active')
        }
      })
    } else {
      windowPath = window.location.pathname.indexOf('-') !== -1 ? window.location.pathname.split('-')[0] : window.location.pathname
      windowHref = window.location.origin + windowPath
      let flag = 0
      $(".nav-item>a").each((index, tab) => {
        if (flag === 1) return
        const tabHref = $(tab).attr('href');
        if (tabHref === windowHref || tabHref.indexOf(windowHref) !== -1 || tabHref.indexOf(windowPath) !== -1) {
          flag = 1
          $(tab).addClass('nav-active')
        }
      })
    }
  })
}