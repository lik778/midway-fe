import $ from 'jquery';
export const oficialNav = function () {
  let dataBread = $('.hover-box').attr('dataBread');
  let color = $('.hover-box').data('hover');
  let leave = $('.hover-box').data('hoverleave');
  let allNav = $('.hover-box');
  let currentUrl = window.location.href;
  let flag = false;
  $('.hover-box').on('mouseover', function () {
    $(this)
      .find('.nav-item')
      .css('background', color);
  });
  $('.hover-box').on('mouseout', function () {
    if (
      $(this).find('.nav-item').prop('href') === currentUrl || $(this).find('.nav-item').prop('href') === dataBread
    ) {
      $(this)
        .find('.nav-item')
        .css('background', color);
    } else if (idList($(this).find('.nav-dropdown-item'))) {
      $(this).find('.nav-item').css('background', color);
    } else {
      $(this).find('.nav-item').css('background', leave);
    }
  });
  allNav.each(function () {
    if (
      $(this).find('.nav-item').prop('href') === currentUrl || dataBread === $(this).find('.nav-item').prop('href')
      ) {
        $(this).find('.nav-item').css('background', color);
        flag = true;
      }
  });
  if (!flag) {
    $('.nav-dropdown-item').each(function () {
      if ($(this).prop('href') === currentUrl || dataBread === $(this).prop('href')) {
        $(this)
          .parent('.nav-dropdown')
          .siblings('.nav-item')
          .css('background', color);
      }
    });
  }
  // 函数验证是否是列表页
  function idList (target) {
    let flag = false;
    target.each(function () {
      if ($(this).prop('href') === currentUrl || dataBread === $(this).prop('href')) {
        flag = true;
        return false;
      }
    });
    return flag;
  }
};