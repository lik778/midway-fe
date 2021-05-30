import $ from 'jquery'
import { eventTracker, semEventTracker } from '../../../common/tracker'

/**
 * 
 * @param {*} type 有类型时取类型 没有说明是店铺
 */
export const qqModule = function (type) {
	$(document).ready(function () {
		$(".qq-title").click(function () {
			$(".customer-box").hide();
			$(".customer-hide").show();
		})
		$(".customer-hide").click(function () {
			$(".customer-box").show();
			$(".customer-hide").hide();
		})

		//点击QQ客服event打点
		$(".customer-box>dl a").click(() => {
			if (type==='sem') {
				semEventTracker("qq-pc", "float-pc")
			} else {
				eventTracker("qq-pc", "float-pc")
			}
		})
		//电话打点
		$(".customer-box .center").click(() => {
			if (type==='sem') {
				semEventTracker("qq-pc", "float-pc")
			} else {
				eventTracker("phone-pc", "float-pc")
			}
		})
		//微信打点
		$(".customer-box .footer").click(() => {
			if (type==='sem') {
				semEventTracker("qq-pc", "float-pc")
			} else {
				eventTracker("wechat-pc", "float-pc")
			}
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

backToTop.click(() => {
	document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
});

const weChatCopyBtn = $('.service-modal__wechat .click-copy');

weChatCopyBtn.click(() => {
	$('#wechat-id-textarea').select();
	document.execCommand('copy');
	weChatCopyBtn.text('复制成功！');
	setTimeout(() => {
		weChatCopyBtn.text('复制号码');
	}, 2000)
})
