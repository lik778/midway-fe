import $ from 'jquery'

export const navModule = function () {
	$(document).on('ready', function () {
		//$(".nav-item > a").each((index, tab) => {
		//	const href = $(tab).attr('href')
		//	if (href.replace(/\/$/, '').endsWith(window.location.pathname.replace(/[n|p]\-?\d*.*\/?$|\/$/, function(result) {
		//		return result[0] === '/' ? '' : result[0]
		//	}))) {
		//	$(tab).addClass('nav-active')
		//}
		//})
		windowPath = window.location.pathname.indexOf('-') !== -1 ? window.location.pathname.split('-')[0] : window.location.pathname
		windowHref = window.location.origin + windowPath

		$(".nav a").each((index, tab) => {
			const h = $(tab).attr('href').replace(/#{0,}/g, '')
			const n = h.slice(-2, -1); //提取导航里的尾部，展示n,p
			const t = windowPath.slice(1, 2); //提取当前url的尾部，展示n,p
			if (h && (h == windowHref || t == n || windowPath.indexOf(h) !== -1)) {
				$(tab).addClass('nav-active')
				//siblings():所有同级a 元素去掉该class。
				$(tab).parent().siblings().find('a').removeClass('nav-active')
			}
		})
	});

}
