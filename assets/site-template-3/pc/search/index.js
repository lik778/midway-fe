import $ from "jquery";
import './index.styl'
import '../layout/index'
import '../../../common/pc/pagination/index'
import { initTabs } from '../components/search/tabs'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { initSem } from '../../../common/pc/contact-form-sem'
initializeSidebarProductSwiper()
initTabs() 

$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem) {
    initSem({
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-block-bgc a')
    })
  }
})
 