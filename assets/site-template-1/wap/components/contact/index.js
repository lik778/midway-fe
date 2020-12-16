import $ from 'jquery'

export const weixinModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).ready(function(){
		$(".wechat-box").click(function(){
			$(".dialog").css("display","block");
			$(".mask").show()
		})
		$(".dialog > .cancel").click(function(){
			$(".dialog").css("display","none");
			$(".mask").hide()
		})
	})
}

