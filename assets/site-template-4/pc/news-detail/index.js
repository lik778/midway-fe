import $ from "jquery";
import './index.styl';
import '../layout';
import { initializeSidebarProductSwiper } from '../components/sidebar';
import Swiper from 'swiper';
import { initSem } from '../../../common/pc/contact-form-sem'
import { leaveLeads } from '../components/common/contact-form'
import { contactMessage } from '../components/contact-message'
contactMessage()
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
    autoHeight: true, //高度随内容变化
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
    on: {
      resize: function () {
        this.update(); //窗口变化时，更新Swiper的一些属性，如宽高等
      },
    },
  });
  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-container a')
    })
  }

  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('a')
    })
  }
})
