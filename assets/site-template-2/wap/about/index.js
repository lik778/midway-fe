import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { initAboutus } from '../components/aboutus/index'
import { leaveLeads } from '../../../common/contact-form'
import { initSem } from '../../../common/wap/contact-form-sem'

initAboutus()
leaveLeads()

$(document).on('ready', function () {

  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'about',
      gotoOtherPageA: $('a')
    })
  }
})
