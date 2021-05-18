import $ from 'jquery'

const all = $(".tab-header .all")
const sample = $(".tab-header .sample")
const open = $(".s-open")
const off = $(".s-off")
export const tabModule = function(){
	$(document).on('ready',function(){
		open.on('click',function(){
			all.show();
			sample.hide();
			open.hide()
			off.show()
		})
		off.on('click',function(){
			sample.show();
			all.hide();
			open.show()
			off.hide()
		})
		//wapd端顶部的tab导航，与当前链接匹配时高亮
		const windowPath=window.location.pathname;
		$(".tab-header a").each((index,tab) => {
			const h = $(tab).attr('href')
			if(h.indexOf(windowPath)> -1){
				$(tab).addClass('tab-active')
				//siblings():所有同级a 元素去掉该class。
				$(tab).parent().siblings().find('a').removeClass('tab-active')
			}
		})
	})
}