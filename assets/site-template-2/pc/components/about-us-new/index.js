import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker'
export const aboutUs = function () {
  $(document).on('ready', function () {
    $(".bottom-right").on('click',() => {
			$(".phone .phoneNumber-full").addClass('active')
			$(".phone .phoneNumber-full").removeClass('none')
			$(".phone .phoneNumber-slice").addClass('none')
			$(".phone .phoneNumber-slice").removeClass('active')
			$(".bottom-right").hide()
			eventTracker('phone-pc', 'top-pc');
    })
    // 视频播放按钮的控制
    var flag = true
    $('audio').on('click', function () {
      if (flag) {
        $('.ico-video').css('display', 'none')
        flag = false
      } else {
        $('.ico-video').css('display', 'block')
        flag = true
      }
    })
})
}
