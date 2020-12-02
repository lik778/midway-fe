import $ from 'jquery'

export const qqModule = function() {
	$(document).ready(function(){
		$(".qq-title").click(function(){
			$(".customer-box").hide();
		});
		$(".customer-hide").click(function(){
			$(".customer-box").show();
		});
	});
}



