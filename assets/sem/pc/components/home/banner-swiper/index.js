import Swiper from 'swiper';

export const bannerSwiper = () => {
  // 首页推荐产品轮播
  new Swiper('#banner-list .swiper-container', {
    loop: true,
    speed:1000,
    autoplay: {
      delay: 3000,
      waitForTransition: true
    },
  
    pagination: {
      el: '#banner-list .swiper-pagination',
      clickable: true,
    },
  
    navigation: {
      nextEl: '#banner-list .swiper-button-next',
      prevEl: '#banner-list .swiper-button-prev',
    },
  });
  
}