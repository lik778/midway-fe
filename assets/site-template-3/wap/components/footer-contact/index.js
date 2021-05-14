import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker';

function copyToClip(content, dom) {
	var aux = document.createElement("input");
	aux.setAttribute("value", content);
	aux.setAttribute("readonly", "readonly");
	dom.append(aux);
	aux.select();
	document.execCommand("copy");
	aux.remove();
	alert( "微信号已复制成功,请打开微信添加");
}

export const footerContactModule = function(){
	$(document).on('ready',function(){
		const copyAddWechat = $('.wechat-box');
		copyAddWechat.on('click',function(){
			const data = $(this).data('value')
			if ( data != '' )
				copyToClip(data, copyAddWechat)
		})

		//点击底部浮层打点
		$(".online-box").click(()=>{
			eventTracker("53kf-wap", "bottom-wap")
		});
		$(".wechat-box").click(()=>{
			eventTracker("wechat-wap", "bottom-wap")
		});
		$(".phone-box").click(()=>{
			eventTracker("phone-wap", "bottom-wap")
		})
	})
}

