import $ from 'jquery';
import './index.styl';
import '../layout';
import '../../../common/pc/pagination/index'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { initSem } from '../../../common/pc/contact-form-sem'

initializeSidebarProductSwiper()

$(document).on('ready', function () {
  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('a')
    })
  }
})