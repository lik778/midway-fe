import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker';

export const qqModule = function() {
	$(document).on('ready',function(){
		$(".qq-title").on('click',function(){
			$(".customer-box").hide();
			$(".customer-hide").show();
		});
		$(".customer-hide").on('click',function(){
			$(".customer-box").show();
			$(".customer-hide").hide();
		});

		//点击QQ客服event打点
		$(".customer-box>dl a").on('click',()=>{
			eventTracker("qq-pc", "float-pc")
		});
		//电话打点
		$(".customer-box .center").on('click',()=>{
			eventTracker("phone-pc", "float-pc")
		});
		//微信打点
		$(".customer-box .footer").on('click',()=>{
			eventTracker("wechat-pc", "float-pc")
		});
	})
}


