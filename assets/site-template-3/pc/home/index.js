import $ from 'jquery';
import './index.styl';
import '../layout/index';
import Swiper from 'swiper';
import { leaveLeads } from '../components/contact-us';
import { productSwiper } from '../components/home/product-swiper';
import { viewPhone } from '../components/home/viewPhone';


leaveLeads()
productSwiper()
viewPhone()

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

  // sem需要禁止二跳
  if (isSem) {
    function gotoContactUs(e) {
      e.preventDefault()
      window.location.href = '#contactUsSem'
    }

    $('.official-nav-block-bgc a').on('click', gotoContactUs)
    $('.banner-list a').on('click', gotoContactUs)
    $('.container a').on('click', gotoContactUs)
  }
})

