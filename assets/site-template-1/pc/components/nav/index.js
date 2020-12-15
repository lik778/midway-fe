import $ from 'jquery'

export const navModule = function() {
	$(document).ready(function(){
		$(".nav > ul > li >a").click(function(){
			$(this).siblings().removeClass('nav-active');
			$(this).addClass('nav-active');
		})
	});
}