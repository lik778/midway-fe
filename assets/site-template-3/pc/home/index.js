import $ from 'jquery';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { viewPhone } from '../components/home/viewPhoneNew';
import { initSem } from '../../../common/pc/contact-form-sem';

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
    const $next = document.querySelector('#banner-list .swiper-button-next')
    $next && $next.addEventListener('click', pauseAllBannerVideo)
    const $prev = document.querySelector('#banner-list .swiper-button-prev')
    $prev && $prev.addEventListener('click', pauseAllBannerVideo)
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
      // 点击显示电话号码
      $('.bottom-right').on('click', function () {
        $('.showphone').text('3057')
      })
  // 计算行高
     // 高度/行高=文本行数
    //  var rowNum=Math.round($(".body-content").height()/parseFloat($(".body-content").css('line-height')));
  // if (rowNum === 6) {
  //   // alert($(".body-content").text().replace(/.(\.\.\.\.)?$/,"......"))
  //   //   $(".body-content").text($(".body-content").text().replace(/.(\.\.\.\.\.\.\.)?$/,"......"))
  //   $('.view-detail').css('display','block')
  // }
  var nowWord = $('.body-content').text().length
  var newWord
  if (nowWord > 270) {
    $('.view-detail').css('display', 'block')
    newWord =  $('.body-content').text().slice(0,270) + '....'
  }
  $('.body-content').text(newWord)
})

