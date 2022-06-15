import $ from 'jquery'

export const initNav = function ($navs) {
  // 匹配规则
  // #contactFormBox 是联系我们 删除href中该字段
  // /\?[\s\S]{0,}/ 删除url中的参数
  // 有全等得亮全等
  // 删除 / 下全等
  // 无全等得亮开头对应列表
	const href = window.location.href.replace(/\?[\s\S]{0,}/, '').replace('#contactFormBox', '')
	let _setTargetElActive = function (index) {
		if (index === -1) return false
		let targetEl = $navs.eq(index)

		if (targetEl[0] != null) {
			let themeColor = targetEl[0].attributes.themeColor.value
			let bgColor = targetEl[0].attributes.borderColor.value
			targetEl.addClass('active').css({"color": themeColor, "border-bottom-color": bgColor})
		}
	}

  const urls = $.map($navs, function (item) {
    return item.getAttribute('navLink')
  })

	// const index = urls.findIndex(item => item === href)

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
		return _setTargetElActive(index)
  }

  let baseUrl = urls[0]
  if (href.startsWith(`${baseUrl}p`)) {
    const index = urls.findIndex(item => item === `${baseUrl}pl.html`)
		return _setTargetElActive(index)
  }
  if (href.startsWith(`${baseUrl}n`)) {
    const index = urls.findIndex(item => item === `${baseUrl}nl.html`)
		return _setTargetElActive(index)
  }
}
