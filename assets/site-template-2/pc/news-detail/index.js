import $ from "jquery";
import './index.styl';
import '../layout';
import { initializeSidebarProductSwiper } from '../components/sidebar';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { initSem } from '../../../common/pc/contact-form-sem'

initializeSidebarProductSwiper()
leaveLeads()

$(document).on('ready', function () {
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
  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-block-bgc a')
    })
  }
})
