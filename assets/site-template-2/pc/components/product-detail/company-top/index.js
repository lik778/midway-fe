import $ from "jquery"
import { eventTracker } from "../../../../../common/tracker"
import { init400Btn } from "../../../../../common/pc/official-400-btn"

init400Btn()

export const viewTel = function () {

  $(document).on("ready", function () {
    $(".online-btn").on("click", () => {
      eventTracker("53kf-pc", "vad-pc")
    });
  })

  // 视频初始化
  const $productVideo = document.querySelector('.company video')
  if ($productVideo) {
    const $cover = document.querySelector('.company .video-cover')
    $cover.addEventListener('click', evt => {
      $productVideo.play()
      $cover.remove()
      evt.stopPropagation()
    })
  }
}