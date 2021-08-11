import $ from 'jquery';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { viewPhone } from '../components/home/viewPhone';
import { initSem } from '../../../common/pc/contact-form-sem'

import './index.styl';
import '../layout/index';

leaveLeads()
viewPhone()

$(document).on('ready', function () {

  // 轮播图初始化
  const swiper = new Swiper('#banner-list .swiper-container', {
    loop: true,
    speed: 1000,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      waitForTransition: true,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '#banner-list .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '#banner-list .swiper-button-next',
      prevEl: '#banner-list .swiper-button-prev',
    },
    on: {
      slideChange: () => {
        pauseAllBannerVideo()
        swiper.autoplay.start()
      }
    }
  })

  /* 轮播视频初始化 */

  const $bannerVideos = document.querySelectorAll('#banner-list video')
  const $bannerVideoCovers = [...$bannerVideos].map($video => {
    return $video.parentElement.parentElement.querySelector('.video-cover')
  })
  function pauseAllBannerVideo () {
    [...$bannerVideos].map(x => x.pause())
  }

  const hasBannerVideo = $bannerVideos.length > 0
  if (hasBannerVideo) {
    // 点击封面或视频播放视频
    const play = idx => {
      swiper.autoplay.stop()
      $bannerVideos[idx].play()
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

  /* 关于我们视频初始化 */

  const $aboutUsVideo = document.querySelector('.about-us-picture video')
  const hasAboutVideo = $aboutUsVideo
  const $aboutUsVideoCovers = hasAboutVideo
    ? $aboutUsVideo.parentElement.parentElement.querySelector('.video-cover')
    : null
  if (hasAboutVideo) {
    // 点击封面或视频播放视频
    $aboutUsVideo.addEventListener('click', () => {
      $aboutUsVideo.paused
        ? $aboutUsVideo.play()
        : $aboutUsVideo.pause()
    })
    $aboutUsVideoCovers.addEventListener('click', evt => {
      $aboutUsVideo.play()
      $aboutUsVideoCovers.remove()
      evt.stopPropagation()
    })
  }

  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'home',
      contactForm: $('#contactUs .contact-us__message'),
      contactFormParent: $('#contactUs'),
      formA: $('.official-nav-block-bgc a,.banner-list a,#layout-content a').not('.products a,.about-us-bgc a,.new-center .news-data-box a'),
      gotoOtherPageA: $('.products a,.about-us-bgc a,.new-center .news-data-box a')
    })
  }
})

