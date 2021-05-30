import Swiper from 'swiper'

var swiper = new Swiper('.swiper-container', {
    speed:1000,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: true
    },
    //分页器
    pagination: {
      el: '.swiper-container .swiper-pagination',
      clickable: true,
    },
    //前进后退按钮
    navigation: {
      nextEl: '.swiper-container .swiper-button-next',
      prevEl: '.swiper-container .swiper-button-prev',
    },
  });


