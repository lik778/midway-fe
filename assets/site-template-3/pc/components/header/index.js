import $ from 'jquery'

//本页目的：只要页面归属某个导航栏，则该导航区块高亮
export const navModule = function () {
	$(document).on('ready', function () {
		const windowHref = window.location.href.indexOf('-') !== -1 ? window.location.href.split('-')[0] : window.location.href
		const windowPath = window.location.pathname.indexOf('-') !== -1 ? window.location.pathname.split('-')[0] : window.location.pathname
		$(".nav-item >a").each((index, tab) => {
			const tabHref = $(tab).attr('href');
			if (tabHref === windowHref || tabHref.indexOf(windowHref) !== -1 || tabHref.indexOf(windowPath) !== -1) {
				$(tab).addClass('nav-active')
			}
		})
	})
}
