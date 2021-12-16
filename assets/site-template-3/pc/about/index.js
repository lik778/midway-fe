import $ from 'jquery';
import './index.styl'
import '../layout/index';
import { leaveLeads } from '../components/contact-us'
import { viewPhone } from '../components/contact-form-companyInfo';
import { initSem } from '../../../common/pc/contact-form-sem';

leaveLeads()
viewPhone()

$(document).on('ready', function () {

  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      account: isAccount,
      sem: isSem, 
      type: 'about',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-container a')
    })
  }

  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'about',
      gotoOtherPageA: $('a')
    })
  }
})