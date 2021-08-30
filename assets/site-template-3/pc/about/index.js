import $ from 'jquery';
import './index.styl'
import '../layout/index';
import { leaveLeads } from '../components/contact-us'
import { viewPhone } from '../components/contact-form-companyInfo';
import { initSem } from '../../../common/pc/contact-form-sem';

leaveLeads()
viewPhone()

$(document).on('ready', function () {

  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'about',
      gotoOtherPageA: $('a')
    })
  }
})