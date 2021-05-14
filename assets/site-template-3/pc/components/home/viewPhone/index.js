import $ from 'jquery'

export const viewPhone = function() {
	$(document).ready(function() {
		$(".view-all-phone").click(() => {
			$(".phone .phoneNumber-full").addClass('active')
			$(".phone .phoneNumber-full").removeClass('none')
			$(".phone .phoneNumber-slice").addClass('none')
			$(".phone .phoneNumber-slice").removeClass('active')
			$(".view-all-phone").hide()
		})
	})
}
