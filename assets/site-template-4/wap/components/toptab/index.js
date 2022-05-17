import $ from 'jquery'

export const tabModule = function(){
	$(document).on('ready',function(){
		const all = $(".all")
		const img = $(".tab-header img")
		const mask = $(".mask")
		const btn = $(".all .btn")
		const html = $('html')

		img.on('click', function(){
			mask.show()
			all.show()
			html.css({'height':'100vh', 'overflow': 'hidden'})
		})
		mask.on('click', function(){
			all.hide()
			mask.hide()
			html.css({'height':'auto', 'overflow': 'auto'})
		})
		btn.on('click', function () {
			all.hide()
			mask.hide()
			html.css({'height':'auto', 'overflow': 'auto'})
		})

		//wap端顶部的tab导航，与当前链接匹配时高亮
		const windowPath=window.location.pathname
		if (windowPath.indexOf('-') === -1) return
		$(".tab-header a > p").each((index,tab) => {
			const h = $(tab).attr('link')
			if(h.indexOf(windowPath) != -1){
				let targetEl = $(tab)
				let themeColor = targetEl[0].attributes.themeColor.value
				let bgColor = targetEl[0].attributes.bgColor.value
				targetEl.addClass('active').css({"color": themeColor, background: bgColor})
			}
		})

		$(".all a").each((index,tab) => {
			const x = $(tab).attr('href')
			if(x.indexOf(windowPath) != -1){
				let targetEl = $("a#selected-tag > p")
				let themeColor = targetEl[0].attributes.themeColor.value
				let bgColor = targetEl[0].attributes.bgColor.value
				targetEl.addClass('active').css({"color": themeColor, background: bgColor})
				targetEl.addClass('tab-active').text($(tab).text())
			}
		})
	})
}
