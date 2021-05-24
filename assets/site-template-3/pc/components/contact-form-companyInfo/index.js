import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker'

export const viewPhone = function() {
	$(document).on('ready',function() {
		$(".phone1 .view-phone").on('click',() => {
			$(".phone1  .phoneNumber-full").removeClass('hide')
			$(".phone1  .phoneNumber-slice").addClass('hide')
			$(".phone1  .view-phone").addClass('hide')
			eventTracker('phone-pc','company-info-pc')
		})
		$(".phone2  .view-phone").on('click',() => {
			$(".phone2 .phoneNumber-full").removeClass('hide')
			$(".phone2 .phoneNumber-slice").addClass('hide')
			$(".phone2 .view-phone").addClass('hide')
			eventTracker('phone-pc','company-info-pc')
		})
	})
}
