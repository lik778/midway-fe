import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { initAboutus } from '../components/aboutus/index'
import { leaveLeads1 } from '../components/contact-us-form/index'
import { leaveLeads } from '../../../common/contact-form'
import { initCompanyInfo } from '../components/company-info/index'
import { initSem } from '../../../common/wap/contact-form-sem'


initAboutus()
leaveLeads1()
leaveLeads()
initCompanyInfo()

// sem下禁止用户二跳 
$(document).on("ready", function () {
  if (isSem === '1') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'home',
      contactForm: $('#contactForm'),
      contactFormParent: $('#layout-content'),
      formA: $('#layout-content a').not('.products a,.news-list a'),
      gotoOtherPageA: $('.products a,.news-list a')
    })
  }

  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'home',
      gotoOtherPageA: $('a')
    })
  }
})
