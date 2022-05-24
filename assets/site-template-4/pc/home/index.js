import './index.styl';
import '../layout';
import $ from 'jquery';
import Swiper from 'swiper';
import { initSem } from '../../../common/pc/contact-form-sem'
import { aboutUs } from '../components/home/about-us'
import { leaveLeads } from '../components/common/contact-form'
import { contactMessage } from '../components/contact-message'
import { seflAdvantage } from '../components/home/self-advantage'
import { productList } from '../components/home/product-list'
import { productListNew } from '../components/home/product-list-new'
import { newLists } from '../components/home/news-list'
import { productCat } from '../components/home/product-catogeries'
import { aboutContactTel } from '../components/home/about-contact-tel'
contactMessage()
leaveLeads()
aboutUs()
seflAdvantage()
productList()
productListNew()
newLists()
productCat()
aboutContactTel()
$(document).on('ready', function () {
  // 处理pagination选中后的颜色
  let color = $('.swiper-pagination').attr('homeColor')
  console.log(color)
  let nums = {
    '#336FFF': 1,
    '#EF1F1F': 2,
    '#6CB436': 3,
    '#BF8452': 4,
    '#343434': 5
  }
  // 轮播产品
	new Swiper('#banner-container  .swiper-container', {
		watchSlidesProgress: true,
		slidesPerView: 'auto',
		centeredSlides: true,
		loop: true,
		loopedSlides: 5,
		autoplay: {
			delay: 5000,
			waitForTransition: true,
			pauseOnMouseEnter: true
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

	const $bannerVideos = [...document.querySelectorAll('#banner-list .swiper-container video')]

	const swiper = new Swiper('#banner-list .swiper-container', {
		loop: true,
		speed: 1000,
		autoplay: {
			delay: 3000,
			waitForTransition: true
		},
		autoHeight: true, //高度随内容变化
		pagination: {
			el: '#banner-list .swiper-pagination',
			clickable: true,
			bulletActiveClass: `my-bullet-active-${nums[color]}`
		},
		navigation: {
			nextEl: '#banner-list .swiper-button-next',
			prevEl: '#banner-list .swiper-button-prev',
		},
		on: {
			resize: function () {
				//窗口变化时，更新Swiper的一些属性，如宽高等
				this.update()
			},
			slideChange: () => {
				$bannerVideos.map(x => x.pause())
				swiper.autoplay.start()
			}
		}
	})

	if (swiper.$el) {
		const $swiper = swiper.$el.length ? swiper.$el[0] : swiper.$el
		const $slides = $swiper.querySelectorAll('.swiper-slide')
		const getCurSlide = () => $slides[swiper.activeIndex]
		const getVideo = () => {
			const $curSlide = getCurSlide()
			return [
				$curSlide.querySelector('video'),
				$curSlide.querySelector('.video-cover')
			]
		}
		$swiper.addEventListener('click', () => {
			const [$video, $cover] = getVideo()
			if ($cover) {
				$cover.remove()
				$video.play()
			}
		})
	}

	/* 视频播放时暂停轮播 */
	$bannerVideos.map($video => {
		$video.onplay = () => {
			swiper.autoplay.stop()
			window._cbs && window._cbs.pauseAll()
		}
		$video.onpause = () => {
			swiper.autoplay.start()
			window._cbs && window._cbs.resumeAll()
		}
	})

	/* 关于我们视频初始化 */
	const $aboutUsVideo = document.querySelector('.about-us-bgc video')
	const hasAboutVideo = $aboutUsVideo
	const $aboutUsVideoCovers = hasAboutVideo
		? $aboutUsVideo.parentElement.parentElement.querySelector('.video-cover')
		: null
	if (hasAboutVideo) {
		// 点击封面或视频播放视频
		$aboutUsVideoCovers.addEventListener('click', evt => {
			$aboutUsVideo.play()
			$aboutUsVideoCovers.remove()
			evt.stopPropagation()
		})
	}

	// sem需要禁止部分内容二跳
	// tapd:https://www.tapd.cn/20095111/prong/stories/view/1120095111001038653
	if (isSem === '1') {
		initSem({
			account: isAccount,
			sem: isSem,
			type: 'home',
			contactForm: $('#contactUs .contact-us__message'),
			contactFormParent: $('#contactUs'),
			formA: $('.official-nav-container a,.banner-content a,#layout-content a').not('.banner-content a,.product-list a,.about-us-bgc a,.news-list a'),
			gotoOtherPageA: $('.banner-content a,.product-list a,.about-us-bgc a,.news-list a')
		})
	}

	if (isSem === '2') {
		initSem({
			account: isAccount,
			sem: isSem,
			type: 'home',
			gotoOtherPageA: $('a')
		})
	}
})

