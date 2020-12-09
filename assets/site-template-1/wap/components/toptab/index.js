import $ from 'jquery'

export const tabModule = function(){
	$(document).ready(function(){
		//$(".more-about").click(function(){
		//	$(".tab-header>ul").toggleClass("tab-hidden");
		//	$(".more-about>img").toggleClass("img-rotate");
		//	$(".more-about").toggleClass("change-more-about")
		//})
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
	})
}