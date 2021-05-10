import './index.styl';
import '../layout/index';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { productSwiper } from '../components/home/product-swiper';
import { viewPhone } from '../components/home/viewPhone';


leaveLeads()
productSwiper()
viewPhone()


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
