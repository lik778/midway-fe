import Swiper from 'swiper';

const $bannerVideos = [...document.querySelectorAll('.swiper-container video')]
const $coverVideos = [...document.querySelectorAll('.swiper-container .video-cover')]

let $swiper, $slides

const swiper = new Swiper('.swiper-container', {
  speed: 1000,
  centeredSlides: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    waitForTransition: true,
  },
  pagination: {
    el: '.swiper-container .swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-container .swiper-button-next',
    prevEl: '.swiper-container .swiper-button-prev',
  },
  on: {
    slideChange: function () {
      if (!$swiper) return
      $bannerVideos.forEach((x, index) => x.pause())
      $coverVideos.forEach((x, index) => x.classList.remove('play'))
      if (!$swiper.classList.contains('fullscreen')) {
        this.autoplay.start()
      } else {
        this.autoplay.stop()
      }
    },
    init: function () {
      const _this = this
      const timer = setInterval(function () {
        /* 轮播图 */
        if (_this.$el) {
          clearInterval(timer)
          $swiper = _this.$el.length ? _this.$el[0] : _this.$el
          $slides = $swiper.querySelectorAll('.swiper-slide')
          const $swiperMask = document.getElementById('swiper-fullscreen-mask')
          const getCurSlide = () => $slides[swiper.activeIndex]
          const getVideo = () => {
            const $curSlide = getCurSlide()
            return [
              $curSlide.querySelector('video'),
              $curSlide.querySelector('.video-cover')
            ]
          }
          const addClickEvent = function () {
            const [$video, $cover] = getVideo()
            if ($video) {
              const isPaused = $video.paused
              if (isPaused) {
                if (!$swiper.classList.contains('fullscreen')) {
                  $swiper.classList.add('fullscreen')
                }
                if ($cover) {
                  $cover.classList.add('play-flag')
                  $cover.classList.add('play')
                }
                $video.play()
              } else {
                $video.pause()
                $cover.classList.remove('play')
                $swiper.classList.remove('fullscreen')
              }
            } else {
              $swiper.classList.toggle('fullscreen')
            }
          }
          $swiper.addEventListener('click', addClickEvent)
          console.log($swiperMask)
          $swiperMask.addEventListener('click', function(){
            const [$video, $cover] = getVideo()
            if ($video) {
              $video.pause()
              $cover.classList.remove('play')
              $swiper.classList.remove('fullscreen')
            }
          })
          /* 视频播放时暂停轮播 */
          $bannerVideos.map($video => {
            $video.onplay = function () {
              swiper.autoplay.stop()
              window._cbs && window._cbs.pauseAll()
            }
            $video.onpause = function () {
              if (!$swiper.classList.contains('fullscreen')) {
                swiper.autoplay.start()
                window._cbs && window._cbs.resumeAll()
              }
            }
          })
        }
      }, 10)
    }
  }
})
