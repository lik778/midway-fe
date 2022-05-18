import $ from 'jquery';
import './index.styl'
import '../layout';
import '../components/common/pagination'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { cateListActive } from '../components/sidebar/cate-list'
import { initSem } from '../../../common/pc/contact-form-sem'
import { leaveLeads } from '../components/common/contact-form'
initializeSidebarProductSwiper()
cateListActive()
leaveLeads()
$(document).on('ready', function () {
  let hoverList = $('.news-content__title').attr('hoverList')
  $('.news-content__title').on('mouseover',function() {
    $(this).css('color',hoverList)
  })
  $('.news-content__title').on('mouseout',function() {
    $(this).css('color','#333')
  })
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