import './index.styl';
import '../layout/index';
import Swiper from 'swiper';
import { contactUsModule } from '../components/sidebar/contact-us/index';

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


