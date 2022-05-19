import $ from "jquery";
import './index.styl';
import '../layout';
import { leaveLeads } from '../components/common/contact-form'
import { initSem } from '../../../common/pc/contact-form-sem'
import { mediaShow } from '../components/product-detail/media-show'
import { initializeSidebarProductSwiper } from '../components/sidebar'
import { cateListActive } from '../components/sidebar/cate-list'
leaveLeads()
mediaShow()
initializeSidebarProductSwiper()
cateListActive()
$(document).on('ready', function () {
  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('#layout-content .container a,.official-nav-container a')
    })
  }
  
  if (isSem === '2') {
    initSem({
      account: isAccount,
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('a')
    })
  }
  let hoverColor = $('#companyshop').data('hover')
  let theme = $('#companyshop').data('theme')
  $('#companyshop').on('mouseover',function() {
    $('#companyshop').css('background',hoverColor)
  })
  $('#companyshop').on('mouseout',function() {
    $('#companyshop').css('background',theme)
  })
})
