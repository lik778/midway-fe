import $ from 'jquery';
import './index.styl'
import '../layout/index';
import '../../../common/pc/pagination/index'
import { initCateList } from '../components/product/cateList'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { initSem } from '../../../common/pc/contact-form-sem'

initializeSidebarProductSwiper()
initCateList()

$(document).on('ready', function () {

  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('a')
    })
  }
})