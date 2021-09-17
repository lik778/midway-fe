import $ from 'jquery';
import Swiper from 'swiper';
import { init400Btn } from '../../../../../common/pc/official-400-btn';
import { eventTracker } from '../../../../../common/tracker';
init400Btn();
export const mediaShow = function() {
  $(document).on('reday', function() {
    $('.online-btn').on('click', () => {
      eventTracker('53kf-pc', 'vad-pc');
    });
  });
  var swiper = new Swiper('.swiper-container', {
    cssMode: true,
    mousewheel: true,
    keyboard: true,
    slidesPerView: 4,
    spaceBetween: 10,
    slidesPerGroup: 3,
    // loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  $('.swiper-wrapper').on('click', '.swiper-slide', function(e) {
    console.log(
      $(e.target).children('source').attr('src')
    );
    // 判断当前点击的是不是视频
    if ($(e.target) && $(e.target).children('source').attr('src')) {
      const videoSrc = $(e.target).children('source').attr('src');
      const posterSrc = $(e.target).attr('poster')
      // 将上面的标签替换成视频
      const video = `<video poster=${posterSrc} object-fit><source src=${videoSrc} type="video/mp4"><source/><video/>`
      $('.left-headImg').html(video)
    } else {
      // 不存在视频
      const nowSrc = $(e.target).attr('src');
      // 更换上面的链接
      const img = `<img src=${nowSrc}>`
      $('.left-headImg').html(img)
    }
    $('.swiper-slide img').removeClass('add-border');
    $('.swiper-slide video').removeClass('add-border');
    $(e.target).addClass('add-border');

  });
};
