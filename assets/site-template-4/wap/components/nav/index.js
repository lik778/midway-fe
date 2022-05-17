import $ from 'jquery'

export const initNavToggle = function () {
  $(function () {
    $('.trigger').on('click', function () {
      $(this).toggleClass('active')
			let svgIcon = $('.trigger > .icon-active')
			svgIcon.css({fill: svgIcon[0].attributes.themecolor.value})
      $('.nav-all').toggleClass('active')
    })
  })
}
