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
		$(".tab-header a").each((index,tab) => {
			const h = $(tab).attr('href')
			if(h.indexOf(windowPath) != -1){
				$(tab).addClass('tab-active')
				//siblings():所有同级a 元素去掉该class。
				//$(tab).parent().siblings().find('a').removeClass('tab-active')
			}
		})

		$(".all a").each((index,tab) => {
			const x = $(tab).attr('href')
			if(x.indexOf(windowPath) != -1){
				$(tab).addClass('tab-active')
			}
		})
	})
}