import './index.styl';
import Swiper from 'swiper';
import { qqModule } from '../components/customer-service/index';
import { navModule } from '../components/nav/index';
import { contactUsModule } from '../components/sidebar/contact-us/index';

navModule()
qqModule()
contactUsModule()

var swiper = new Swiper('.swiper-container', {
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


