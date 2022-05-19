import Swiper from 'swiper';
import $ from 'jquery'
export const initializeSidebarProductSwiper = () => {
  // 推荐产品轮播
  let color = $('#swiper').data('color')
  let nums = {
    '#336FFF': 1,
    '#D8010D': 2,
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
}

