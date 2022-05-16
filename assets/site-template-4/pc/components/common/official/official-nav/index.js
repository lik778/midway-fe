import $ from 'jquery'
export const  oficialNav = function() {
  let color = $('.nav-item').data('hover')
  let leave = $('.nav-item').data('hoverleave')
  let currentUrl = window.location.href
  let allNav = $('.nav-item')
  allNav.each(function() {
    if($(this).prop('href') === currentUrl) {
      $(this).css('background',color)
    } else {
      $(this).css('background',leave)
    }
  })
  $('.nav-item').on('mouseover',function() {
    $(this).css('background-color',color)
  })
  $('.nav-item').on('mouseout',function() {
    $(this).css('background-color',leave)
  })
} 
