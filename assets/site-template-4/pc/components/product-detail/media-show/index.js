import $ from 'jquery';
import Swiper from 'swiper';
import { init400Btn } from '../../../../../common/pc/official-400-btn';
import { eventTracker } from '../../../../../common/tracker';
init400Btn();
export const mediaShow = function() {
  $(document).on('ready', function() {
    $('.online-btn').on('click', () => {
      eventTracker('53kf-pc', 'vad-pc');
    });
    $('.searchPhone .phoneContent').on('click',function() {
      $(this).text($('.phoneContent').data('phone'))
    })
  });
   new Swiper('.swiper-container', {
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
  
  let color = $('.media-show-container').attr('mediaShowContainer')
  let nums = {
    '#336FFF': 1,
    '#EF1F1F': 2,
    '#30B015': 3,
		'#BF8452': 4,
    '#343434': 5
  }
  // 缩略图
  $('.swiper-wrapper').on('click', '.swiper-slide', function(e) {
    const  $ThisImg = $(this)
    const  $Imgsrc =  $ThisImg.data('src')
    $('.left-headImg img').attr('src',$Imgsrc)
    if ($ThisImg && $ThisImg.data('video')) {
      // 显示视频和按钮，替换图片
      const $Videosrc =  $ThisImg.data('video')
      $('.left-headImg video').attr('src',$Videosrc)
      $('.left-headImg .video-wrapper').css('display','block')
      $('#cover').removeClass('video-img hide-video-after').addClass('video-cover')
    }else {
      //  隐藏视频和按钮前，先暂停视频，替换成图片
      const $productVideo = document.querySelector('.left-headImg video');
      if($productVideo) {
        $productVideo.pause()
        $('.left-headImg .video-cover').css('display','block').addClass('hide-video-after')
        $('.left-headImg .video-wrapper').css('display','none')
        $('.left-headImg img').attr('src',$Imgsrc)
      }
    }
    // 设置高亮
    $ThisImg.addClass(`my-slide-active-${nums[color]}`);
    $ThisImg.siblings().removeClass(`my-slide-active-${nums[color]}`);
  });
  // 默认选中第一项
  $('.swiper-slide:first').addClass(`my-slide-active-${nums[color]}`)
    // 视频初始化
    const $productVideo = document.querySelector('.left-headImg video');
    if ($productVideo) {
      const $cover = document.querySelector('.left-headImg .video-cover');
      $cover.addEventListener('click', evt => {
        $productVideo.play();
        $cover.style.display = 'none'
        evt.stopPropagation();
      });
    }
    // 在线咨询效果
    let defaultColor = $('#k53Hover').attr('defaultColor')
    let HoverColor = $('#k53Hover').attr('HoverColor')
    $('#k53Hover').on('mouseover',function() {
      $(this).css('background-color',HoverColor)
    })
    $('#k53Hover').on('mouseout',function() {
      $(this).css('background-color',defaultColor)
    })
};
