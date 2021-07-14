import $ from "jquery";
import './index.styl';
import '../layout/index';
import { initializeSidebarProductSwiper } from '../components/sidebar';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { viewPhone } from '../components/contact-form-companyInfo';
import { initSem } from '../../../common/pc/contact-form-sem'

initializeSidebarProductSwiper()
leaveLeads()
viewPhone()

$(document).on('ready', function () {
  new Swiper('#banner-list .swiper-container', {
    //spaceBetween: 30,
    loop: true,
    speed: 1500,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: true
    },
    //分页器
    pagination: {
      el: '#banner-list .swiper-pagination',
      clickable: true,
    },
    //前进后退按钮
    navigation: {
      nextEl: '#banner-list .swiper-button-next',
      prevEl: '#banner-list .swiper-button-prev',
    },
  });
  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a')
    })
  }
})
