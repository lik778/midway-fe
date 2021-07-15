import $ from "jquery";
// TODO Path alias
import './index.styl'
import '../layout/index'
import '../../../common/wap/pagination/index'
import { leaveLeads } from '../components/contact-form/index'
import { tabModule } from '../components/toptab/index';
import { initTabs } from '../components/search-tabs'
import { initSem } from '../../../common/wap/contact-form-sem'

leaveLeads()
tabModule()
initTabs()

$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'detail',
      gotoOtherPageA: $('#layout-content a')
    })
  }
})
