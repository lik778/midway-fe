import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { initAboutus } from '../components/aboutus/index'
import { leaveLeads1 } from '../components/contact-us-form/index'
import { leaveLeads } from '../components/contact-form/index'
import { initCompanyInfo } from '../components/company-info/index'
import { initContactFormSem } from '../../../common/wap/contact-form-sem'

initAboutus()
leaveLeads1()
leaveLeads()
initCompanyInfo()

// sem下禁止用户二跳 
$(document).on("ready", function () {
  if (isSem) {
    initContactFormSem($('#contactForm'), $('#layout-content'), $('#layout-content a'))
  }
})
