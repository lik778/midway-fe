import $ from 'jquery';
import './index.styl'
import '../layout';
//import { navModule } from '../components/header'
import { initSem } from '../../../common/pc/contact-form-sem'
import { leaveLeads } from '../../../common/contact-form'
import { seflAdvantage } from '../components/home/self-advantage'
import { contactMessage } from '../components/contact-message'
//navModule()
leaveLeads()
seflAdvantage()
contactMessage()
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