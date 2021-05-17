import $ from 'jquery'

export const viewPhone = function() {
	$(document).ready(function() {
		$(".viewPhone").click(() => {
			$(".info-item .phoneNumber-full").removeClass('hide')
			$(".info-item .phoneNumber-slice").addClass('hide')
			$(".info-item .viewPhone").addClass('hide')
		})
	})
}
