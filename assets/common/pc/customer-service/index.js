import $ from 'jquery'
import { eventTracker } from '../../../common/tracker'

export const qqModule = function() {
	$(document).on('ready',function(){
		$(".qq-title").on('click',function(){
			$(".customer-box").hide();
			$(".customer-hide").show();
		})
		$(".customer-hide").on('click',function(){
			$(".customer-box").show();
			$(".customer-hide").hide();
		})

		//点击QQ客服event打点
		$(".service-item .qq").on('click',()=>{
			eventTracker("qq-pc", "float-pc")
		})
		//电话打点
		$(".mobile").on('click',()=>{
			eventTracker("phone-pc", "float-pc")
		})
		//微信打点
		$(".wechat").on('click',()=>{
			eventTracker("wechat-pc", "float-pc")
		})
	})
}

const backToTop = $('#back-to-top');
const windowHeight = window.innerHeight || document.documentElement.clientHeight;

$(document).scroll(() => {
	if ($(document).scrollTop() > windowHeight) {
		backToTop.slideDown();
	} else {
		backToTop.slideUp();
	}
});

backToTop.on('click',() => {
	document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
});

const weChatCopyBtn = $('.service-modal__wechat .click-copy');

weChatCopyBtn.on('click',() => {
	$('#wechat-id-textarea').select();
	document.execCommand('copy');
	weChatCopyBtn.text('复制成功！');
	setTimeout(() => {
		weChatCopyBtn.text('复制号码');
	}, 2000)
})

