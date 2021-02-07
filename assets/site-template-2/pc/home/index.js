import './index.styl';
import $ from 'jquery'
import Swiper from 'swiper';
import { qqModule } from '../components/customer-service/index';
qqModule()

// 轮播图
new Swiper('#banner-container .swiper-container', {
	watchSlidesProgress: true,
	slidesPerView: 'auto',
	centeredSlides: true,
	loop: true,
	loopedSlides: 5,
	autoplay: {
		delay: 5000,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	on: {
		progress: function() {
			for (let i = 0; i < this.slides.length; i++) {
				const slide = this.slides.eq(i);
				const slideProgress = this.slides[i].progress;
				let modify = 1;
				if (Math.abs(slideProgress) > 1) {
					modify = (Math.abs(slideProgress) - 1) * 0.4 + 1;
				}
				const translate = slideProgress * modify * 130 + 'px';
				const scale = 1 - Math.abs(slideProgress) / 4;
				const zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
				slide.transform('translateX(' + translate + ') scale(' + scale + ')');
				slide.css('zIndex', zIndex);
				slide.css('opacity', 1);
				if (Math.abs(slideProgress) > 3) {
					slide.css('opacity', 0);
				}
			}
		},
		setTransition: function(transition) {
			for (let i = 0; i < this.slides.length; i++) {
				const slide = this.slides.eq(i)
				slide.transition(transition);
			}
		}
	}
});

function initialize () { 
  setTimeout(() => {
		const map = new BMapGL.Map('baidu-map'); 
		const point = new BMapGL.Point(121.368895,31.13529);  // 创建点坐标 
		map.centerAndZoom(point, 16);         
		map.enableScrollWheelZoom(true);
		// map.addControl(new BMapGL.ZoomControl());
		// map.addControl(new BMapGL.ScaleControl());

		const marker = new BMapGL.Marker(point);
		map.addOverlay(marker);

		// 信息窗口
		const infoWindow = new BMapGL.InfoWindow("地址：上海市闵行区顾戴路2337号维璟中心A栋", {
			width : 150,
			title : "百姓网股份有限公司" ,
		});
		map.openInfoWindow(infoWindow, point);
	}, 1000)
}

// 百度地图
function loadScript() { 
  const script = document.createElement("script"); 
  script.src = "https://api.map.baidu.com/api?v=1.0&type=webgl&ak=tvd0R7EFrjmY7CKT153pdNnTGiEo6Bp4&callback=initialize";
  document.head.appendChild(script); 
} 

loadScript();
initialize();
