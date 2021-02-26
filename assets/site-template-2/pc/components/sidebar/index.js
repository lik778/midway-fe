import Swiper from 'swiper';

export const initializeSidebarProductSwiper = () => {
  // 推荐产品轮播
  new Swiper('#product-swiper .swiper-container', {
    speed: 400,
    autoplay: {
      delay: 10000
    },
    pagination: {
      el: '#product-swiper .swiper-pagination',
      type: 'bullets',
    },
  });
}