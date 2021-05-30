import './index.styl';
import '../layout';
import $ from 'jquery';
import { initializeSidebarProductSwiper } from '../components/sidebar';

initializeSidebarProductSwiper()

// 清除过滤
$('.product-child-page .search-crumbs ul li:last-child span').on('click',() => {
  window.location.href = window.location.href.replace(/\/p-.*$/, '/p')
})
