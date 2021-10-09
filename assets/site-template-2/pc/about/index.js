import $ from 'jquery';
import './index.styl'
import '../layout';
//import { navModule } from '../components/header'
import { leaveLeads } from '../components/contact-us'
import { initSem } from '../../../common/pc/contact-form-sem'

//navModule()
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