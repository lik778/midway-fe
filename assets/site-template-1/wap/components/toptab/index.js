import $ from 'jquery'

export const tabModule = function(){
	$(document).ready(function(){
		$(".more-about").click(function(){
			$(".tab-header>ul").toggleClass("tab-hidden");
			$(".more-about>img").toggleClass("img-rotate");
			$(".more-about").toggleClass("change-more-about")
		})
	})
}