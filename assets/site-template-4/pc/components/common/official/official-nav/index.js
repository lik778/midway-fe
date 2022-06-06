import $ from 'jquery'
export const  oficialNav = function() {
  let color = $('.hover-box').data('hover')
  let leave = $('.hover-box').data('hoverleave')
  let allNav = $('.hover-box')
  let currentUrl = window.location.href
  // function idDetails(target) {
  //   return (/pl-|p-/i.test(currentUrl) && /pl./i.test(target)) || (/nl-|n-/i.test(currentUrl) && /nl./i.test(target))
  // }
  $('.hover-box').on('mouseover',function() {
    $(this).find('.nav-item').css('background',color)
  })
  $('.hover-box').on('mouseout',function() {
    if($(this).find('.nav-item').prop('href') === currentUrl) {
      $(this).find('.nav-item').css('background',color)
    } else if(idList($(this).find('.nav-dropdown-item'))) {
      $(this).find('.nav-item').css('background',color)
    }  else {
      $(this).find('.nav-item').css('background',leave)
    }
  })
  allNav.each(function() {
    if($(this).find('.nav-item').prop('href') === currentUrl) {
      $(this).find('.nav-item').css('background',color)
      return false
    }
    $('.nav-dropdown-item').each(function() {
      if($(this).prop('href') === currentUrl) {
        $(this).parent('.nav-dropdown').siblings('.nav-item').css('background',color)
        return false
      }
    })
  })
  // 函数验证是否是列表页
  function idList(target) {
    let flag = false
    target.each(function() {
      if($(this).prop('href') === currentUrl) {
        flag = true
        return false
      }
    })
    return flag
  }
}
