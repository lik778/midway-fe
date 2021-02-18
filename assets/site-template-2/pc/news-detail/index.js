import './index.styl';
import { qqModule } from '../components/customer-service/index';
import Swiper from 'swiper';

qqModule()

// 推荐产品轮播
new Swiper('#product-swiper .swiper-container', {
	speed: 400,
	autoplay: {
		delay: 10000
	},
	pagination: {
    el: '#product-swiper .swiper-pagination',
    type: 'bullets',
  },
});
