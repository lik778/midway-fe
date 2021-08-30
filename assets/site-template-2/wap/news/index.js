import $ from 'jquery';
import './index.styl'
import '../components/swiper/index'
import '../layout/index'
import '../../../common/wap/pagination/index'
import { tabModule } from '../components/toptab/index';
import { initSem } from '../../../common/wap/contact-form-sem'

tabModule()

$(document).on('ready', function () {

  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('a')
    })
  }
})
