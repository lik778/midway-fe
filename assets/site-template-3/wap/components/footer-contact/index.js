import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker';

function copyToClip(content, message) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  alert(message || "复制成功");
}

export const footerContactModule = function(){
	//等待DOM 结构加载完成，然后再执行操作
	$(document).ready(function(){
		// $(".wechat-box").click(function(){
		// 	$(".dialog").css("display","block");
		// 	$(".mask").show()
		// });
		// $(".dialog > .cancel").click(function(){
		// 	$(".dialog").css("display","none");
		// 	$(".mask").hide()
		// });

		$(".wechat-box").on('click',function(){
			const data = $(this).data('value')
			if ( data != '' )
				copyToClip(data)
		})

		//点击底部浮层打点
		$(".sms-box").click(()=>{
			eventTracker("message-wap", "bottom-wap")
		});
		$(".wechat-box").click(()=>{
			eventTracker("wechat-wap", "bottom-wap")
		});
		$(".phone-box").click(()=>{
			eventTracker("phone-wap", "bottom-wap")
		})
	})
}

