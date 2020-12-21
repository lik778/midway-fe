import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker';

export const qqModule = function() {
	$(document).ready(function(){
		$(".qq-title").click(function(){
			$(".customer-box").hide();
			$(".customer-hide").show();
		});
		$(".customer-hide").click(function(){
			$(".customer-box").show();
			$(".customer-hide").hide();
		});

		//点击QQ客服event打点
		$(".customer-box a").click(()=>{
			eventTracker("qq-pc", "float-pc")
		});
	})
}



