import Swiper from 'swiper'
import $ from 'jquery'

new Swiper('.swiper-container', {
  speed:1000,
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
  on: {
    autoplay: () => pauseAllBannerVideo()
  }
})

const $bannerVideos = document.querySelectorAll('.swiper-container video')
const $bannerVideoCovers = [...$bannerVideos].map($video => {
  return $video.parentElement.parentElement.querySelector('.video-cover')
})
function pauseAllBannerVideo() {
  [...$bannerVideos].map(x => x.pause())
}
const hasBannerVideo = $bannerVideos.length > 0
if (hasBannerVideo) {
  // 点击封面或视频播放视频
  const play = idx => $bannerVideos[idx].play()
    ;[...$bannerVideos].map($video => {
      $video.addEventListener('click', () => {
        $video.paused
          ? $video.play()
          : $video.pause()
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
  document.querySelector('.swiper-container .swiper-button-next').addEventListener('click', pauseAllBannerVideo)
  document.querySelector('.swiper-container .swiper-button-prev').addEventListener('click', pauseAllBannerVideo)
}


