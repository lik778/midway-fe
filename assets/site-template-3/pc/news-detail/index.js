import $ from "jquery";
import './index.styl';
import '../layout/index';
import { initializeSidebarProductSwiper } from '../components/sidebar';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { viewPhone } from '../components/contact-form-companyInfo';
import { initSem } from '../../../common/pc/contact-form-sem'

initializeSidebarProductSwiper()
leaveLeads()
viewPhone()

$(document).on('ready', function () {
  const swiper = new Swiper('#banner-list .swiper-container', {
    //spaceBetween: 30,
    loop: true,
    speed: 1500,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: true
    },
    autoHeight: true, //高度随内容变化
    //分页器
    pagination: {
      el: '#banner-list .swiper-pagination',
      clickable: true,
    },
    //前进后退按钮
    navigation: {
      nextEl: '#banner-list .swiper-button-next',
      prevEl: '#banner-list .swiper-button-prev',
    },
    on: {
      slideChange: () => {
        pauseAllBannerVideo()
        swiper.autoplay.start()
      },
      resize: function () {
        this.update(); //窗口变化时，更新Swiper的一些属性，如宽高等
      },
    }
  })

  /* 轮播视频初始化 */

  const $bannerVideos = document.querySelectorAll('#banner-list video')
  const $bannerVideoCovers = [...$bannerVideos].map($video => {
    return $video.parentElement.parentElement.querySelector('.video-cover')
  })
  function pauseAllBannerVideo() {
    [...$bannerVideos].map(x => x.pause())
  }

  const hasBannerVideo = $bannerVideos.length > 0
  if (hasBannerVideo) {
    // 点击封面播放视频
    const play = idx => {
      $bannerVideos[idx].play()
      swiper.autoplay.stop()
    }
    ;[...$bannerVideos].map($video => {
      $video.addEventListener('click', () => {
        $video.paused
          ? swiper.autoplay.stop()
          : swiper.autoplay.start()
      })
    })
    ;[...$bannerVideoCovers].map(($cover, idx) => {
      $cover.addEventListener('click', evt => {
        play(idx)
        $cover.remove()
        evt.stopPropagation()
      })
    })
    // 切换轮播时暂停视频
    document.querySelector('#banner-list .swiper-button-next').addEventListener('click', pauseAllBannerVideo)
    document.querySelector('#banner-list .swiper-button-prev').addEventListener('click', pauseAllBannerVideo)
  }

  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-block-bgc a')
    })
  }
})
