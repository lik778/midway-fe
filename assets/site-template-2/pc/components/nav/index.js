import $ from 'jquery'

//本页目的：只要页面归属某个导航栏，则该导航区块高亮
export const navModule = function() {
	$(document).ready(function() {
		$(".nav-item > a").each((index, tab) => {
			const href = $(tab).attr('href')
      if (href.replace(/\/$/, '').endsWith(window.location.pathname.replace(/\-?\d*\/?$/, ''))) {
        $(tab).addClass('nav-active')
      }
		})
	})
}
