import Swiper from 'swiper'

const swiper = new Swiper('.swiper-container', {
  speed: 1000,
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
    nextEl: '.swiper-container .swiper-button-next',
    prevEl: '.swiper-container .swiper-button-prev',
  },
  on: {
    slideChange: () => {
      pauseAllBannerVideo()
      swiper.autoplay.start()
    }
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
  // 点击封面播放视频
  const play = idx => {
    $bannerVideos[idx].play()
    swiper.autoplay.stop()
  }
  ;[...$bannerVideoCovers].map(($cover, idx) => {
    $cover.addEventListener('click', evt => {
      play(idx)
      $cover.remove()
      evt.stopPropagation()
    })
  })
  // 切换轮播时暂停视频
  const $next = document.querySelector('.swiper-container .swiper-button-next')
  $next && $next.addEventListener('click', pauseAllBannerVideo)
  const $prev = document.querySelector('.swiper-container .swiper-button-prev')
  $prev && $prev.addEventListener('click', pauseAllBannerVideo)
}
