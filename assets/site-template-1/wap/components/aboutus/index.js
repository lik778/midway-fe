import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker';

export const aboutModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).ready(function(){
		$(".s-open").click(function(){
			$(".aboutus-content>p").removeClass("about-hidden");
			$(".s-open").hide()
			$(".s-off").show()
		});
		$(".s-off").click(function(){
			$(".aboutus-content>p").addClass("about-hidden");
			$(".s-open").show()
			$(".s-off").hide()
		});
		//对拨打电话打点
		$(".introduction a").click(()=>{
			eventTracker("phone-wap", "home-wap")
		})
	})
}

