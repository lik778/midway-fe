import $ from 'jquery'

export const navModule = function() {
	$(document).ready(function(){
		const windowPath=window.location.href;
		$(".nav a").each((index, tab) => {
			const h = $(tab).attr('href')
			if(h==windowPath){
				$(tab).addClass('nav-active')
			}
		})
	});
}