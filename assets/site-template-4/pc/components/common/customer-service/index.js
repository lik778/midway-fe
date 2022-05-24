import $ from 'jquery'
import { eventTracker, semEventTracker } from '../../../../../common/tracker'

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

		//hover53图标event打点
		$("#kf53").on('mouseenter', () => {
			if (type === 'sem') {
				semEventTracker("kf53-pc", "float-pc", "hover")
			} else {
				eventTracker("kf53-pc", "float-pc", "hover")
			}
		})
		
		//点击53客服event打点
		$("#kf53").on('click', () => {
			if (type === 'sem') {
				semEventTracker("kf53-click-pc", "float-pc")
			} else {
				eventTracker("kf53-click-pc", "float-pc")
			}
			if (window.$53) {
				var api = $53.createApi();
				api.push('cmd', 'kfclient');
				api.push('type', 'new');
				api.query();
			} else {
				alert('请稍后再试！')
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
const baxFeedbackCopyBth = $('.service-modal__bax .click-copy');

weChatCopyBtn.on('click', () => {
	$('#wechat-id-textarea').select();
	document.execCommand('copy');
	weChatCopyBtn.text('复制成功！');
	setTimeout(() => {
		weChatCopyBtn.text('复制号码');
	}, 2000)
})

baxFeedbackCopyBth.on('click', () => {
    $('#wechat-id-textarea').select();
	document.execCommand('copy');
	weChatCopyBtn.text('复制成功！');
	setTimeout(() => {
		weChatCopyBtn.text('复制号码');
	}, 2000)
})


const entranceBtn = $('#entrance')
entranceBtn.on('click',()=>{
	const {position} = window.extraContactFormData
	const href = window.location.href
	const id = /(?<=-)\d.*(?=.html)/.exec(href)?/(?<=-)\d.*(?=.html)/.exec(href)[0]:''
	if(id){
		window.location.href = `safeguard?position=${position}&id=${+id}`
	}else{
		window.location.href = `safeguard?position=${position}`
	}
})


// hover 变色
const customerHv = $('#customerHover').attr('customerHv')
const backTopColor = $('#back-to-top').attr('backToTopColor')
$('.back-to-top__text').on('mouseover',function() {
  $(this).css('color',backTopColor)
})
$('.back-to-top__text').on('mouseout',function() {
  $(this).css('color','#333')
})

$('#baixing').on('mouseover',function() {
  $(this).css('color',backTopColor)
})
$('#baixing').on('mouseout',function() {
  $(this).css('color','#409eff')
})

$('.customer-item-hover').on('mouseover',function() {
  $(this).css('background-color',customerHv)
})
$('.customer-item-hover').on('mouseout',function() {
  $(this).css('background-color',backTopColor)
})


