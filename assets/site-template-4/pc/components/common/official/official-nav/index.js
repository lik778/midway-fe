import $ from 'jquery'
export const  oficialNav = function() {
  let color = $('.hover-box').data('hover')
  let leave = $('.hover-box').data('hoverleave')
  let currentUrl = window.location.href
  // function idDetails(target) {
  //   return (/pl-|p-/i.test(currentUrl) && /pl./i.test(target)) || (/nl-|n-/i.test(currentUrl) && /nl./i.test(target))
  // }
  let allNav = $('.hover-box')
  allNav.each(function() {
    if($(this).find('.nav-item').prop('href') === currentUrl) {
      $(this).find('.nav-item').css('background',color)
    } else {
      $(this).find('.nav-item').css('background',leave)
    }
  })
  $('.hover-box').on('mouseover',function() {
    $(this).find('.nav-item').css('background',color)
  })
  $('.hover-box').on('mouseout',function() {
    if($(this).find('.nav-item').prop('href') === currentUrl) {
      $(this).find('.nav-item').css('background',color)
    } else {
      $(this).find('.nav-item').css('background',leave)
    }
  })
}
