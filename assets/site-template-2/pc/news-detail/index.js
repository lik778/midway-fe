import './index.styl';
import { qqModule } from '../components/customer-service/index';
import { initializeSidebarProductSwiper } from '../components/sidebar';
import Swiper from 'swiper';

qqModule()
initializeSidebarProductSwiper()

new Swiper('#news-detail-swiper .swiper-container', {
  //spaceBetween: 30,
  speed:1500,
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
  },
});
