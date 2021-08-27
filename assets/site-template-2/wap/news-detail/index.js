import $ from 'jquery';
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { menusModule } from '../components/header/index'
import { leaveLeads } from '../components/contact-form/index'
import { initSem } from '../../../common/wap/contact-form-sem'

menusModule()
leaveLeads()

$(document).on('ready', function () {

  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('a')
    })
  }
})
