import $ from 'jquery';
import './index.styl'
import '../layout';
import '../../../common/pc/pagination/index'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { cateListActive } from '../components/sidebar/cate-list'
import { initSem } from '../../../common/pc/contact-form-sem'

initializeSidebarProductSwiper()
cateListActive()

$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-block-bgc a')
    })
  }

  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('a')
    })
  }
})