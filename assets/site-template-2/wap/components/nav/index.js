import $ from 'jquery'

export const navModule = function() {
	$(document).ready(function() {
		//$(".nav-item > a").each((index, tab) => {
		//	const href = $(tab).attr('href')
		//	if (href.replace(/\/$/, '').endsWith(window.location.pathname.replace(/[n|p]\-?\d*.*\/?$|\/$/, function(result) {
		//		return result[0] === '/' ? '' : result[0]
		//	}))) {
		//	$(tab).addClass('nav-active')
		//}
		//})
		const windowHref = window.location.href;
		const windowPath = window.location.pathname

		$(".nav a").each((index, tab) => {
			const h = $(tab).attr('href')
			const n = h.slice(-2,-1); //提取导航里的尾部，展示n,p
			const t = windowPath.slice(1, 2); //提取当前url的尾部，展示n,p
			if(h==windowHref || t==n){
				$(tab).addClass('nav-active')
				//siblings():所有同级a 元素去掉该class。
				$(tab).parent().siblings().find('a').removeClass('nav-active')
			}
		})
	});

}