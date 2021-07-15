import $ from "jquery";
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { menusModule } from '../components/header/index'
import { leaveLeads } from '../components/contact-form/index'
import { initSem } from '../../../common/wap/contact-form-sem'

menusModule()
leaveLeads()

$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'detail',
      gotoOtherPageA: $('#layout-content a,.header a')
    })
  }
})