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
		//wapd端顶部的tab导航，与当前链接匹配时高亮
		const windowPath=window.location.pathname;
		$(".tab-header a").each((index,tab) => {
			const h = $(tab).attr('href')
			if(h.indexOf(windowPath)> -1){
				$(tab).addClass('tab-active')
				//如果是同一页面其他元素也有该类，则加这个。现在每点击一次会跳转新页面，所以下面用不上了
				//$(tab).parent().siblings().find('a').removeClass('tab-active')
			}
		})
	})
}