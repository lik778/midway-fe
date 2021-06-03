import $ from 'jquery';
import './index.styl';
import '../layout';
import '../../../common/pc/pagination/index'
import { initializeSidebarProductSwiper } from '../components/sidebar';

initializeSidebarProductSwiper()

// 清除过滤
$('.product-child-page .search-crumbs ul li:last-child span').on('click',() => {
  window.location.href = window.location.href.replace(/\/p-.*$/, '/p')
})
