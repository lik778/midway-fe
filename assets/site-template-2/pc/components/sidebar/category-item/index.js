import $ from 'jquery'

export const categoryModule = function(){
	$(document).ready(function(){
		const windowPath=window.location.pathname;
		$(".category-btn").each((index, tab) => {
			const h = $(tab).attr('href')
			if(h.indexOf(windowPath)> -1){
				$(tab).addClass('category-active')
			}
		})
	})
}