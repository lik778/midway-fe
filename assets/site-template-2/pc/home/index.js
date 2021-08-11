import './index.styl';
import '../layout';
import $ from 'jquery';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { initSem } from '../../../common/pc/contact-form-sem'
import { aboutUs } from '../components/about-us-new'
leaveLeads()
aboutUs()
$(document).on('ready', function () {
	// 轮播图
	new Swiper('#banner-container .swiper-container', {
		watchSlidesProgress: true,
		slidesPerView: 'auto',
		centeredSlides: true,
		loop: true,
		loopedSlides: 5,
		autoplay: {
			delay: 5000,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		on: {
			progress: function () {
				for (let i = 0; i < this.slides.length; i++) {
					const slide = this.slides.eq(i);
					const slideProgress = this.slides[i].progress;
					let modify = 1;
					if (Math.abs(slideProgress) > 1) {
						modify = (Math.abs(slideProgress) - 1) * 0.39 + 1;
					}
					const translate = slideProgress * modify * 115 + 'px';
					const scale = 1 - Math.abs(slideProgress) / 4;
					const zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
					slide.transform('translateX(' + translate + ') scale(' + scale + ')');
					slide.css('zIndex', zIndex);
					slide.css('opacity', 1);
					if (Math.abs(slideProgress) > 3) {
						slide.css('opacity', 0);
					}
				}
			},
			setTransition: function (transition) {
				for (let i = 0; i < this.slides.length; i++) {
					const slide = this.slides.eq(i)
					slide.transition(transition);
				}
			}
		}
	});


	// sem需要禁止部分内容二跳
	// tapd:https://www.tapd.cn/20095111/prong/stories/view/1120095111001038653
	if (isSem) {
		initSem({
			type: 'home',
			contactForm: $('#contactUs .contact-us__message'),
			contactFormParent: $('#contactUs'),
			formA: $('.official-nav-block-bgc a,.banner-content a,#layout-content a').not('.banner-content a,.product-list a,.about-us-bgc a,.news-box .content a'),
			gotoOtherPageA: $('.banner-content a,.product-list a,.about-us-bgc a,.news-box .content a')
		})
	}
			// 新闻模块
	// var nowWord = $('.item-card .item-content').text().length
	// var newWord
	// if (nowWord > 44) {
	// 	newWord = $('.item-card .item-content').text().slice(1,44) + '.......'
	// }
	// $('.item-card .item-content').text(newWord)
})

