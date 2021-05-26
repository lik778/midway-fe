import $ from 'jquery';
import Swiper from 'swiper';

export const productSwiper = () => {
  $(document).on('ready', function () {
    new Swiper('.product-swiper-box .swiper-container', {
      speed: 1500,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        waitForTransition: true
      },
      pagination: {
        el: '.product-swiper-box .swiper-pagination',
        clickable: true,
        bulletActiveClass: 'product-swiper-pagination-active',
        bulletClass: 'product-swiper-pagination'
      },
    });

    $('.vad-btn').on('click', function () {
      const phone = $(this).data('phone')
      alert(`请复制手机号：${phone}`)
    })
  })
}