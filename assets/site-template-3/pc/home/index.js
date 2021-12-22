import $ from 'jquery';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { viewPhone } from '../components/home/about-us';
import { initSem } from '../../../common/pc/contact-form-sem';
import { contactForm } from '../../../common/pc/contact-form'
import './index.styl';
import '../layout/index';

leaveLeads();
viewPhone();
contactForm();

$(document).on('ready', function() {

  const $bannerVideos = [...document.querySelectorAll('#banner-list .swiper-container video')]

  // 轮播图初始化
  const swiper = new Swiper('#banner-list .swiper-container', {
    loop: true,
    speed: 1000,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      waitForTransition: true,
      pauseOnMouseEnter: true,
    },
    autoHeight: true, //高度随内容变化
    pagination: {
      el: '#banner-list .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '#banner-list .swiper-button-next',
      prevEl: '#banner-list .swiper-button-prev',
    },
    on: {
      resize: function () {
        this.update(); //窗口变化时，更新Swiper的一些属性，如宽高等
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

  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'home',
      contactForm: $('#contactUs .contact-us__message'),
      contactFormParent: $('#contactUs'),
      formA: $(
        '.official-nav-container a,.banner-list a,#layout-content a',
      ).not('#product-list-box a,.about-us-bgc a,.new-center .news-box a'),
      gotoOtherPageA: $(
        '#product-list-box a,.about-us-bgc a,.new-center .news-box a',
      ),
    });
  }
  
  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'home',
      gotoOtherPageA: $('a')
    })
  }

  // 点击显示电话号码
  $('.bottom-right').on('click', function () {
    $('.showphone').text('3057');
  })
})
