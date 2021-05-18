import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker'

export const qqModule = function() {
	$(document).on('ready',function(){
		//点击QQ客服event打点
		$(".qq").hover(()=>{
			eventTracker("qq-pc", "float-pc")
		})
		//电话打点
		$(".mobile").hover(()=>{
			eventTracker("phone-pc", "float-pc")
		})
		//微信打点
		$(".wechat").hover(()=>{
			eventTracker("wechat-pc", "float-pc")
		})
	})
}

const backToTop = $('#back-to-top');
//窗口高度
const windowHeight = window.innerHeight || document.documentElement.clientHeight;
//$(document).scrollTop()滚动条举例原始顶部高度，当大于窗口高度时，显示返回顶部箭头

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

