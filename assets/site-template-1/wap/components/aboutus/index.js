import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker';

const all = $(".aboutus-content .all")
const sample = $(".aboutus-content .sample")
const open = $(".s-open")
const off = $(".s-off")

export const aboutModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).on('ready',function(){
		//$(".s-open").on('click',function(){
		//	$(".aboutus-content>p").removeClass("about-hidden");
		//	$(".s-open").hide()
		//	$(".s-off").show()
		//});
		//$(".s-off").on('click',function(){
		//	$(".aboutus-content>p").addClass("about-hidden");
		//	$(".s-open").show()
		//	$(".s-off").hide()
		//});

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

		//对拨打电话打点
		$(".introduction a").on('click',()=>{
			eventTracker("phone-wap", "home-wap")
		})
	})
}

