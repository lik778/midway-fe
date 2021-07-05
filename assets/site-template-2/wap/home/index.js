import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { aboutModule } from '../components/aboutus/index'
import { leaveLeads } from '../components/contact-form/index'
import { initCompanyInfo } from '../components/company-info-home/index'
import { initContactFormSem } from '../../../common/wap/contact-form-sem'

aboutModule()
leaveLeads()
initCompanyInfo()

// sem下禁止用户二跳 
$(document).on("ready", function () {
  if (isSem) {
    initContactFormSem($('#contactForm'), $('#layout-content'), $('#layout-content a'))
  }
})

