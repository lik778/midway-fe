import $ from 'jquery'
import { eventTracker } from '../../../../../common/tracker'

export const viewPhone = function() {
	$(document).on('ready',function() {
		$(".view-all-phone").on('click',() => {
			$(".phone .phoneNumber-full").addClass('active')
			$(".phone .phoneNumber-full").removeClass('none')
			$(".phone .phoneNumber-slice").addClass('none')
			$(".phone .phoneNumber-slice").removeClass('active')
			$(".view-all-phone").hide()
			eventTracker('phone-pc', 'top-pc');
		})
	})
}
