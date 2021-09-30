import $ from 'jquery';
import './index.styl'
import '../components/swiper/index'
import '../layout/index'
import '../../../common/wap/pagination/index'
import { leaveLeads } from '../components/contact-form/index'
import { tabModule } from '../components/toptab/index';
import { initSem } from '../../../common/wap/contact-form-sem'

leaveLeads()
tabModule()

// sem下禁止用户二跳 
$(document).on("ready", function () {
  
  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('a')
    })
  }
})