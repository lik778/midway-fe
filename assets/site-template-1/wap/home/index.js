import './index.styl'
import '../components/common/index'
import Swiper from 'swiper'
import { menusModule } from '../components/header/index'
import { aboutModule } from '../components/aboutus/index'
import { weixinModule } from '../components/contact/index'

aboutModule()
menusModule()
weixinModule()

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
  },
});


