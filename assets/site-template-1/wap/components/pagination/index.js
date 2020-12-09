import $ from 'jquery'

export const aboutModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).ready(function(){
		$(".more-about").click(function(){
			$(".aboutus-content>p").toggleClass("about-hidden");
			$(".more-about>img").toggleClass("img-rotate");
			$(".more-about").toggleClass("change-more-about")
		})
	})
}

