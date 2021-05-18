import $ from 'jquery'

export const viewPhone = function() {
	$(document).ready(function() {
		$(".view-phone").click(() => {
			$(".info-item .phoneNumber-full").addClass('active')
			$(".info-item .phoneNumber-full").removeClass('no-active')
			$(".info-item .phoneNumber-slice").addClass('no-active')
			$(".info-item .phoneNumber-slice").removeClass('active')
			$(".view-phone").hide()
		})
	})
}
