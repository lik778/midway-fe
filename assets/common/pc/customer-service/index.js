import $ from 'jquery'
import { eventTracker, semEventTracker } from '../../../common/tracker'

export const qqModule = function (type) {
	$(document).on('ready', function () {
		$(".qq-title").on('click', function () {
			$(".customer-box").hide();
			$(".customer-hide").show();
		})
		$(".customer-hide").on('click', function () {
			$(".customer-box").show();
			$(".customer-hide").hide();
		})

		//hoverQQ图标event打点
		$("#qq").on('mouseenter', () => {
			if (type === 'sem') {
				semEventTracker("qq-pc", "float-pc", "hover")
			} else {
				eventTracker("qq-pc", "float-pc", "hover")
			}
		})
		//hover电话打点
		$("#mobile").on('mouseenter', () => {
			if (type === 'sem') {
				semEventTracker("phone-pc", "float-pc", "hover")
			} else {
				eventTracker("phone-pc", "float-pc", "hover")
			}
		})
		//hover微信打点
		$("#wechat").on('mouseenter', () => {
			if (type === 'sem') {
				semEventTracker("wechat-pc", "float-pc", "hover")
			} else {
				eventTracker("wechat-pc", "float-pc", "hover")
			}
		})

		//点击QQ客服event打点
		$("#qq .qq-link").on('click', () => {
			if (type === 'sem') {
				semEventTracker("qq-click-pc", "float-pc")
			} else {
				eventTracker("qq-click-pc", "float-pc")
			}
		})

		//微信打点
		$("#wechat .click-copy").on('click', () => {
			if (type === 'sem') {
				semEventTracker("wechat-copy-pc", "float-pc")
			} else {
				eventTracker("wechat-copy-pc", "float-pc")
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

backToTop.on('click', () => {
	document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
});

const weChatCopyBtn = $('.service-modal__wechat .click-copy');

weChatCopyBtn.on('click', () => {
	$('#wechat-id-textarea').select();
	document.execCommand('copy');
	weChatCopyBtn.text('复制成功！');
	setTimeout(() => {
		weChatCopyBtn.text('复制号码');
	}, 2000)
})

