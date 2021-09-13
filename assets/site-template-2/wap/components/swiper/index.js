import Swiper from 'swiper';

const $bannerVideos = [...document.querySelectorAll('.swiper-container video')]

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
      $bannerVideos.map((x, index) => x.pause())
      if ($swiper.classList.contains('fullscreen')) {
        this.autoplay.stop()
        const $video = $slides[this.activeIndex].querySelector('video')
        const $cover = $slides[this.activeIndex].querySelector('.video-cover')
        if ($video) {
          const isPaused = $video.paused
          if (isPaused) {
            $cover && $cover.remove()
            $video.play()
          }
        }
      } else {
        this.autoplay.start()
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
          const getCurSlide = () => $slides[swiper.activeIndex]
          const getVideo = () => {
            const $curSlide = getCurSlide()
            return [
              $curSlide.querySelector('video'),
              $curSlide.querySelector('.video-cover')
            ]
          }
          $swiper.addEventListener('click', function () {
            $swiper.classList.toggle('fullscreen')
            const [$video, $cover] = getVideo()
            if ($video) {
              const isPaused = $video.paused
              if (isPaused) {
                $cover && $cover.remove()
                $video.play()
              } else {
                $video.pause()
              }
            }
          })
        }

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
      }, 10)
    }
  }
})
