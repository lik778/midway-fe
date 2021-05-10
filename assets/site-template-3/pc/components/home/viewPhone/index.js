import $ from 'jquery'

export const viewPhone = function() {
	$(document).ready(function() {
		$(".view-all-phone").click(() => {
			$(".phone .phoneNumber-full").addClass('active')
			$(".phone .phoneNumber-full").removeClass('no-active')
			$(".phone .phoneNumber-slice").addClass('no-active')
			$(".phone .phoneNumber-slice").removeClass('active')
		})
	})
}
