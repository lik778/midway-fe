import Swiper from 'swiper'

const $bannerVideos = document.querySelectorAll('.swiper-container video')

const swiper = new Swiper('.swiper-container', {
  speed: 1000,
  centeredSlides: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    waitForTransition: true
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-container .swiper-button-next',
    prevEl: '.swiper-container .swiper-button-prev',
  },
  on: {
    slideChange: () => {
      $bannerVideos.map(x => x.pause())
      swiper.autoplay.start()
    }
  }
})


/* 轮播图 */
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
  $swiper.classList.toggle('fullscreen')
  const [$video, $cover] = getVideo()
  const isPaused = $video.paused
  if (isPaused) {
    $cover && $cover.remove()
    $video.play()
  }
})
$swiper.addEventListener('dbclick', () => {
  const [$video, $cover] = getVideo()
  const isPaused = $video.paused
  if (isPaused) {
    $cover && $cover.remove()
    $video.play()
  } else {
    $video.pause()
  }
})

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