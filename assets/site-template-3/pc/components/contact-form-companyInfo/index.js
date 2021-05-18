import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker'

export const viewPhone = function() {
	$(document).on('ready',function() {
		$(".view-phone").on('click',() => {
			$(".info-item .phoneNumber-full").removeClass('hide')
			$(".info-item .phoneNumber-slice").addClass('hide')
			$(".info-item .view-phone").addClass('hide')
			eventTracker('phone-pc','company-info-pc')
		})
	})
}
