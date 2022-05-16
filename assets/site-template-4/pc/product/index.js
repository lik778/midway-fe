import $ from 'jquery';
import './index.styl';
import '../layout';
import '../components/common/pagination'
import { initCateList } from '../components/product/cateList'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { initSem } from '../../../common/pc/contact-form-sem'
import { productList } from '../components/product/product-list'
import { leaveLeads } from '../components/common/contact-form'
import { cateListActive } from '../components/sidebar/cate-list'
initializeSidebarProductSwiper()
initCateList()
productList()
leaveLeads()
cateListActive()
$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-container a')
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