import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { aboutModule } from '../components/aboutus/index'
import { leaveLeads } from '../components/contact-form/index'
import { initCompanyInfo } from '../components/company-info-home/index'
import { initSem } from '../../../common/wap/contact-form-sem'

aboutModule()
leaveLeads()
initCompanyInfo()

// sem下禁止用户二跳 
$(document).on("ready", function () {
  // sem需要禁止部分内容二跳
  // tapd:https://www.tapd.cn/20095111/prong/stories/view/1120095111001038653
  if (isSem) {
    initSem({
      type: 'home',
      contactForm: $('#contactForm'),
      contactFormParent: $('#layout-content'),
      formA: $('#layout-content a').not('.products a'),
      gotoOtherPageA: $('.products a')
    })
  }
})

