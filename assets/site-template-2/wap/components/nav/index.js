import $ from 'jquery'

export const initNavToggle = function () {
  $(function () {
    $('.trigger').on('click', function () {
      $(this).toggleClass('active')
      $('.nav-all').toggleClass('active')
    })
  })
}
