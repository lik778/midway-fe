import './index.styl'
import '../layout/index';

import $ from 'jquery';
//import { qqModule } from '../../../common/pc/customer-service/index';
import { initializeSidebarProductSwiper } from '../components/sidebar';
//import { navModule } from '../components/nav'

//qqModule()
//navModule()
initializeSidebarProductSwiper()

// 清除过滤
$('.product-child-page .search-crumbs ul li:last-child span').click(() => {
  window.location.href = window.location.href.replace(/\/p-.*$/, '/p')
})