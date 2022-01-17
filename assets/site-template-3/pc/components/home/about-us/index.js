import $ from 'jquery'
import { eventTracker } from '../../../../../common/tracker'
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
})
}
