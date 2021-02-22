import $ from 'jquery'

export const aboutModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).ready(function(){
		const expandBtn = $('#aboutus-click-to-expand');
		const expandContentSlice = $('.aboutus-content .aboutus-content-slice');
		const expandContentFull = $('.aboutus-content .aboutus-content-full');
		expandBtn.click(() => {
			console.log('click');
			if (expandContentSlice.hasClass('active')) {
				expandContentSlice.removeClass('active')
				expandContentFull.addClass('active')
				expandBtn.removeClass('active')
				expandBtn.html('点击收起')
			} else {
				expandContentSlice.addClass('active')
				expandContentFull.removeClass('active')
				expandBtn.addClass('active')
				expandBtn.html('点击展开')
			}
		})
	})
}

