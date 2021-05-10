import Swiper from 'swiper';

export const productSwiper = () => {
  // 首页推荐产品轮播
  new Swiper('#product-swiper-box .swiper-container', {
    //展示4个
    //slidesPerView: 4,
    speed: 1500,
    //spaceBetween: 20,
    //autoplay: {
    //  delay: 10000,
    //  disableOnInteraction: false,
    //  waitForTransition: true
    //},
    pagination: {
      el: '#product-swiper-box .swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}