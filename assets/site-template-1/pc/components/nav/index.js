import $ from 'jquery'

export const navModule = function() {
	$(document).ready(function(){
		const windowPath=window.location.href;
		console.log('1',windowPath);

		$(".nav a").each((index, tab) => {
			const h = $(tab).attr('href')
			console.log(h,tab);
			if(h==windowPath){
				$(tab).addClass('nav-active')
			}
		})
	});
}