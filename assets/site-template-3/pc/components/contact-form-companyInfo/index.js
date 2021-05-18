import $ from 'jquery'

export const viewPhone = function() {
	$(document).ready(function() {
		$(".view-phone").click(() => {
			$(".info-item .phoneNumber-full").removeClass('hide')
			$(".info-item .phoneNumber-slice").addClass('hide')
			$(".info-item .view-phone").addClass('hide')
		})
	})
}
