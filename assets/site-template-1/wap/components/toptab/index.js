import $ from 'jquery'

const all = $(".tab-header .all")
const sample = $(".tab-header .sample")
const open = $(".s-open")
const off = $(".s-off")
export const tabModule = function(){
	$(document).ready(function(){
		open.click(function(){
			all.show();
			sample.hide();
			open.hide()
			off.show()
		})
		off.click(function(){
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
				//如果是同一页面其他元素也有该类，则加这个。现在每点击一次会跳转新页面，所以下面用不上了
				//$(tab).parent().siblings().find('a').removeClass('tab-active')
			}
		})
	})
}