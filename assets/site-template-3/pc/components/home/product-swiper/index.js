import Swiper from 'swiper';

export const productSwiper = () => {
  // 首页推荐产品轮播
  new Swiper('#product-swiper-box .swiper-container', {
    speed: 1500,
    //autoplay: {
    //  delay: 10000,
    //  disableOnInteraction: false,
    //  waitForTransition: true
    //},
    pagination: {
      el: '#product-swiper-box .swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '#product-swiper-box .swiper-button-next',
      prevEl: '#product-swiper-box .swiper-button-prev',
    },
  });
}