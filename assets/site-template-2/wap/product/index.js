import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import '../../../common/wap/pagination/index'
import { tabModule } from '../components/toptab/index';
import { initSem } from '../../../common/wap/contact-form-sem'

tabModule()

$(document).on('ready', function () {

  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'listing',
      gotoOtherPageA: $('a')
    })
  }
})
