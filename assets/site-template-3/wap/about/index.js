import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { leaveLeads } from '../components/contact-form/index'
import { initCompanyInfo } from '../components/company-info/index'
import { initAboutus } from '../components/aboutus/index'
import { initSem } from '../../../common/wap/contact-form-sem'

initAboutus()
leaveLeads()
initCompanyInfo()


// sem下禁止用户二跳 
$(document).on("ready", function () {
  
  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'about',
      gotoOtherPageA: $('a')
    })
  }
})