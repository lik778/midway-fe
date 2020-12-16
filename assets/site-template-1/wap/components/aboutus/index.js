import $ from 'jquery'

export const aboutModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).ready(function(){
		$(".s-open").click(function(){
			$(".aboutus-content>p").removeClass("about-hidden");
			//$(".s-open>img").toggleClass("img-rotate");
			//$(".more-about").toggleClass("change-more-about")
			$(".s-open").hide()
			$(".s-off").show()
		})
		$(".s-off").click(function(){
			$(".aboutus-content>p").addClass("about-hidden");
			$(".s-open").show()
			$(".s-off").hide()
		})
	})
}

