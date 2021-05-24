import './index.styl';
import '../layout/index';
import { bannerSwiper } from '../components/home/banner-swiper'
import { initCompanyInfo } from '../components/home/company-info'
import { productSwiper } from '../components/home/product-swiper';
import { leaveLeads } from '../components/home/contact-form';

bannerSwiper()
initCompanyInfo()
productSwiper()
leaveLeads()