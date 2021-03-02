import $ from 'jquery'

const all = $(".all")
const img = $(".tab-header img")
const mask = $(".mask")
const btn = $(".all .btn")

export const tabModule = function(){
	$(document).ready(function(){
		img.click(function(){
			mask.show()
			all.show()
		})
		mask.click(function(){
			all.hide()
			mask.hide()
		})
		btn.click(function () {
			all.hide()
			mask.hide()
		})

		//wapd端顶部的tab导航，与当前链接匹配时高亮
		const windowPath=window.location.pathname;
		$("#cateItem").each((index,tab) => {
			console.log($(tab).attr('href'));
			if($(tab).attr('href').indexOf(windowPath) != -1){
				$(tab).addClass('tab-active')
				//siblings():所有同级a 元素去掉该class。
				//$(tab).parent().siblings().find('a').removeClass('tab-active')
			}
		})
	})
}