import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { initAboutus } from '../components/aboutus/index'
import { leaveLeads1 } from '../components/contact-us-form/index'
import { leaveLeads } from '../components/contact-form/index'
import { initCompanyInfo } from '../components/company-info/index'
import { initSem } from '../../../common/wap/contact-form-sem'
import { initPopup } from '../../../common/wap/official-popup'


initAboutus()
leaveLeads1()
leaveLeads()
initCompanyInfo()
initPopup()

// sem下禁止用户二跳 
$(document).on("ready", function () {
  if (isSem) {
    initSem({
      type: 'home',
      contactForm: $('#contactForm'),
      contactFormParent: $('#layout-content'),
      formA: $('#layout-content a').not('.products a,.news-list a'),
      gotoOtherPageA: $('.products a,.news-list a')
    })
  }
})
