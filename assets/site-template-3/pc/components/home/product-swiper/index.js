import Swiper from 'swiper';

export const productSwiper = () => {
  // 推荐产品轮播
  new Swiper('#product-swiper-box .swiper-container', {
    speed: 400,
    autoplay: {
      delay: 10000
    },
    pagination: {
      el: '#product-swiper-box .swiper-pagination',
      type: 'bullets',
    },
  });
}