import $ from 'jquery';
import './index.styl'
import '../layout/index';
import '../../../common/pc/pagination/index'

import { initializeSidebarProductSwiper } from '../components/sidebar';
import { cateListActive } from '../components/sidebar/cate-list'
import { initSem } from '../../../common/pc/contact-form-sem'

initializeSidebarProductSwiper()
cateListActive()

$(document).on('ready', function () {

  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('a')
    })
  }
})