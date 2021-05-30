import Swiper from 'swiper'
import $ from 'jquery'

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
      el: '.swiper-pagination',
      clickable: true,
    },
    //前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });


