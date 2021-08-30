import $ from "jquery";
import './index.styl';
import '../layout';
import { viewTel } from '../components/product-detail/company-top';
import { leaveLeads } from '../components/contact-us';
import { initSem } from '../../../common/pc/contact-form-sem'

leaveLeads()
viewTel()

$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-block-bgc a')
    })
  }
  
  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('a')
    })
  }
})
