import $ from 'jquery';
import './index.styl';
import '../layout/index';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { viewPhone } from '../components/home/viewPhoneNew';
import { initSem } from '../../../common/pc/contact-form-sem';


leaveLeads()
viewPhone()
aboutUsNew()

$(document).on('ready', function () {
  new Swiper('#banner-list .swiper-container', {
    loop: true,
    speed: 1000,
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
  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'home',
      contactForm: $('#contactUs .contact-us__message'),
      contactFormParent: $('#contactUs'),
      formA: $('.official-nav-block-bgc a,.banner-list a,#layout-content a').not('.products a,.about-us-bgc a,.new-center .news-data-box a'),
      gotoOtherPageA: $('.products a,.about-us-bgc a,.new-center .news-data-box a')
    })
  }
      // 点击显示电话号码
      $('.bottom-right').on('click', function () {
        $('.showphone').text('3057')
      })
})

