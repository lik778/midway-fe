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
    loopFillGroupWithBlank: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.left-contentImg .swiper-button-next',
      prevEl: '.left-contentImg .swiper-button-prev',
    },
  });
  // 缩略图
  $('.swiper-wrapper').on('click', '.swiper-slide img', function(e) {
    const  $ThisImg = $(this);
    const  $Imgsrc =  $ThisImg.attr('src')
    $('.left-headImg img').attr('src',$Imgsrc)
    if ($ThisImg && $ThisImg.data('video')) {
      // 显示视频和按钮，替换图片 
      const $Videosrc =  $ThisImg.data('video')
      $('.left-headImg video').attr('src',$Videosrc)
      $('.left-headImg .video-wrapper').css('display','block')
      $('#cover').removeClass('video-img').addClass('video-cover')
    }else {
      //  隐藏视频和按钮，替换成图片
      $('.left-headImg .video-wrapper').css('display','none')
      $('#cover').removeClass('video-cover').addClass('video-img')
    }
    // 设置高亮
    $ThisImg.parent('.swiper-slide').addClass('my-slide-active');
    $ThisImg.parent('.swiper-slide').siblings().removeClass('my-slide-active');
  });
  // 默认选中第一项
  $('.swiper-slide:first').addClass('my-slide-active')
    // 视频初始化
    const $productVideo = document.querySelector('.left-headImg video');
    if ($productVideo) {
      const $cover = document.querySelector('.left-headImg .video-cover');
      $cover.addEventListener('click', evt => {
        $productVideo.play();
        $cover.remove();
        evt.stopPropagation();
      });
    }
};
