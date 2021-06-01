import $ from "jquery";
import { eventTracker } from "../../../../common/tracker";

export const footerContactModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).on("ready",function(){
		$(".wechat-box").on("click",function(){
			$(".dialog").css("display","block");
			$(".mask").show()
		});
		$(".dialog > .cancel").on("click",function(){
			$(".dialog").css("display","none");
			$(".mask").hide()
		});

		//点击底部浮层打点
		$(".online-box").on("click",()=>{
			eventTracker("53kf-wap", "bottom-wap")
		});
		$(".wechat-box").on("click",()=>{
			eventTracker("wechat-wap", "bottom-wap")
		});
		$(".phone-box").on("click",()=>{
			eventTracker("phone-wap", "bottom-wap")
		})
	})
}

