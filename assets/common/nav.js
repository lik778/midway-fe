import $ from 'jquery'

export const initNav = function ($navs) {
  // 匹配规则
  // #contactFormBox 是联系我们 删除href中该字段
  // /\?[\s\S]{0,}/ 删除url中的参数
  // 有全等得亮全等
  // 删除 / 下全等
  // 无全等得亮开头对应列表
  const href = window.location.href.replace(/\?[\s\S]{0,}/, '').replace('#contactFormBox', '')


  const urls = $.map($navs, function (item) {
    return item.getAttribute('href')
  })

  const index = urls.findIndex(item => {
    if (item === href) return true
    if (item.endsWith('/') && !href.endsWith('/')) {
      return item === `${href}/`
    }
    if (!item.endsWith('/') && href.endsWith('/')) {
      return `${item}/` === href
    }
  })
  if (index !== -1) {
    $navs.eq(index).addClass('active')
    return
  }

  let baseUrl = urls[0]
  if (href.startsWith(`${baseUrl}p`)) {
    const index = urls.findIndex(item => item === `${baseUrl}pl.html`)
    $navs.eq(index).addClass('active')
    return
  }
  if (href.startsWith(`${baseUrl}n`)) {
    const index = urls.findIndex(item => item === `${baseUrl}nl.html`)
    $navs.eq(index).addClass('active')
    return
  }
}