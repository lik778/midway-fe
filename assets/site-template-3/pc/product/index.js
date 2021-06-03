import $ from 'jquery';
import './index.styl'
import '../layout/index';
import '../../../common/pc/pagination/index'
import { initCateList } from '../components/product/cateList'
import { initializeSidebarProductSwiper } from '../components/sidebar';

initializeSidebarProductSwiper()
initCateList()

// 清除过滤
$('.product-child-page .search-crumbs ul li:last-child span').on('click', () => {
  window.location.href = window.location.href.replace(/\/p-.*$/, '/p/')
})
