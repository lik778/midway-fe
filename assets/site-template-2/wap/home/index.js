import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { initAboutus } from '../components/aboutus/index'
import { leaveLeads } from '../components/contact-form/index'
import { initCompanyInfo } from '../components/company-info-home/index'
import { initProductListHot } from '../components/product-list-hot'
import { initSem } from '../../../common/wap/contact-form-sem'

initAboutus()
leaveLeads()
initCompanyInfo()
initProductListHot()

// sem下禁止用户二跳 
$(document).on("ready", function () {
  // sem需要禁止部分内容二跳
  // tapd:https://www.tapd.cn/20095111/prong/stories/view/1120095111001038653
  if (isSem === '1') {
    initSem({
      sem: isSem,
      type: 'home',
      contactForm: $('#contactForm'),
      contactFormParent: $('#layout-content'),
      formA: $('#layout-content a').not('.products a'),
      gotoOtherPageA: $('.products a')
    })
  }
  
  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'home',
      gotoOtherPageA: $('a')
    })
  }
})

