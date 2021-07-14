import $ from "jquery";
import './index.styl'
import '../layout/index';
import { viewTel } from '../components/product-detail/company-top'
import { leaveLeads } from '../components/contact-us'
import { viewPhone } from '../components/contact-form-companyInfo';
import { initSem } from '../../../common/pc/contact-form-sem'

viewPhone()
leaveLeads()
viewTel()

$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a')
    })
  }
})
 