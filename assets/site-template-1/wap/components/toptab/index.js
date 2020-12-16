import $ from 'jquery'
export const tabModule = function(){
	$(document).ready(function(){

		$(".s-open").click(function(){
			$(".tab-header>ul").removeClass("tab-hidden");
			//$(".s-open>img").toggleClass("img-rotate");
			//$(".more-about").toggleClass("change-more-about")
			$(".s-open").hide()
			$(".s-off").show()
		})
		$(".s-off").click(function(){
			$(".tab-header>ul").addClass("tab-hidden");
			$(".s-open").show()
			$(".s-off").hide()
		})

		var currentHref=window.location.pathname;
		$(".tab-header a").each((index,tab) => {
			const h = $(tab).attr('href')
			if(h.indexOf(currentHref)> -1){
				$(tab).addClass('active').parent().siblings().find('a').removeClass('active')
			}
		})
	})
}