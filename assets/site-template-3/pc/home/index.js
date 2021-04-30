import './index.styl';
import '../layout/index';
import $ from 'jquery';
import Swiper from 'swiper';
//import { qqModule } from '../../../common/pc/customer-service/index';
//import { navModule } from '../components/nav';
import { leaveLeads } from '../components/contact-us';

//qqModule()
//navModule()
leaveLeads()

// 轮播图
//new Swiper('#banner-container .swiper-container', {
//	watchSlidesProgress: true,
//	slidesPerView: 'auto',
//	centeredSlides: true,
//	loop: true,
//	loopedSlides: 5,
//	autoplay: {
//		delay: 5000,
//	},
//	navigation: {
//		nextEl: '.swiper-button-next',
//		prevEl: '.swiper-button-prev',
//	},
//	on: {
//		progress: function() {
//			for (let i = 0; i < this.slides.length; i++) {
//				const slide = this.slides.eq(i);
//				const slideProgress = this.slides[i].progress;
//				let modify = 1;
//				if (Math.abs(slideProgress) > 1) {
//					modify = (Math.abs(slideProgress) - 1) * 0.4 + 1;
//				}
//				const translate = slideProgress * modify * 130 + 'px';
//				const scale = 1 - Math.abs(slideProgress) / 4;
//				const zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
//				slide.transform('translateX(' + translate + ') scale(' + scale + ')');
//				slide.css('zIndex', zIndex);
//				slide.css('opacity', 1);
//				if (Math.abs(slideProgress) > 3) {
//					slide.css('opacity', 0);
//				}
//			}
//		},
//		setTransition: function(transition) {
//			for (let i = 0; i < this.slides.length; i++) {
//				const slide = this.slides.eq(i)
//				slide.transition(transition);
//			}
//		}
//	}
//});
new Swiper('.swiper-container', {
  //spaceBetween: 30,
  speed:1500,
  centeredSlides: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    waitForTransition: true
  },
  //分页器
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  //前进后退按钮
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});


