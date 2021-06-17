import $ from 'jquery'

const goto = (vars, page) => {
	vars.push(`page=${page}`)
	var query = vars.join('&')
	window.location.href = `${window.location.pathname.split('?')[0]}?${query}`
}

export const initPagination = function () {
	$(document).on('ready', function () {
		var query = window.location.search.substring(1);
		var vars = query.split("&").filter(item => item && item.indexOf('page') === -1);
		$('.prev-page').on('click', function () {
			var page = $(this).data('page')
			if (!page) {
				return
			}
			goto(vars, page)
		})
		$('.next-page').on('click', function () {
			var page = $(this).data('page')
			if (!page) {
				return
			}
			goto(vars, page)
		})
		$('#pageSelect').on('change', function (e) {
			goto(vars, e.target.value)
		})
	})
}

initPagination()

