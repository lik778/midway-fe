import Swiper from 'swiper';
import $ from 'jquery'
export const initializeSidebarProductSwiper = () => {
  // 推荐产品轮播
  let color = $('#swiper').data('color')
  let hoverTheme = $('.side-news-list .news').attr('newsHoverTheme')
  let nums = {
    '#336FFF': 1,
    '#EF1F1F': 2,
    '#30B015': 3,
		'#BF8452': 4,
    '#343434': 5
  }
  new Swiper('#product-swiper .swiper-container', {
    speed: 400,
    autoplay: {
      delay: 10000
    },
    pagination: {
      el: '#product-swiper .swiper-pagination',
      type: 'bullets',
      clickable: true,
      bulletActiveClass: `my-bullet-active-${nums[color]}`
    },
  });
  $('.news').each(function() {
    $(this).on('mouseover',function() {
      $(this).css({
        'color': hoverTheme,
        'font-weight': 'bold'
      })
    })
    $(this).on('mouseout',function() {
      $(this).css('color','#666')
    })
  })
  $('.side-product').each(function() {
    let hoverTheme = $(this).find('.product-desc').attr('hoverProductDesc')
    $(this).on('mouseover',function() {
      $(this).find('.product-desc').css({
        'background-color': hoverTheme,
        'color': '#fff'
      })
      $(this).find('.product-desc p').css({
        'color': '#fff'
      })
    })
    $(this).on('mouseout',function() {
      $(this).find('.product-desc').css({
        'background-color':'#f7f7f7',
      })
      $(this).find('.product-desc p').css({
        'color': '#5d5d5d'
      })
    })
  })
}

