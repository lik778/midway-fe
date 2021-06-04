import $ from 'jquery';
import './index.styl'
import '../layout/index';
import '../../../common/pc/pagination/index'
import { initCateList } from '../components/product/cateList'
import { initializeSidebarProductSwiper } from '../components/sidebar';

initializeSidebarProductSwiper()
initCateList()