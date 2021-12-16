import $ from 'jquery';

export const initNavFn = function () {

  $(function () {
    const navSelectIcon = $('.nav-select-icon');
    const drawerNavBox = $('.drawer-nav-box');
    const drawerNavMask = $('.drawer-nav-mask');
    const navItem = drawerNavBox.find('.nav-item')
    const body = $('body');
    const html = $('html');
    body.css({ transition: 'all 0.5s' });

    function showNavs() {
      navSelectIcon.addClass('active');
      drawerNavBox.addClass('active');
      drawerNavMask.addClass('active');
      body.css({ transform: 'translateX(180px)' });
      html.css({ width: '100vw', height: '100vh', overflow: 'hidden' });
    }
    navSelectIcon.on('click', showNavs);

    function hideNavs() {
      navSelectIcon.removeClass('active');
      drawerNavBox.removeClass('active');
      drawerNavMask.removeClass('active');
      body.css({ transform: '' });
      html.css({ width: 'auto', height: 'auto', overflow: 'visible' });
    }

    drawerNavMask.on('click', hideNavs);

    navItem.on('click', hideNavs);

    const imgSrc = { homePage: '//file.baixing.net/202105/ebad606fef0001ec73d15fc4e51921c4.png', productListPage: '//file.baixing.net/202105/609ea6ca5dc441be4501410db0509cfe.png', productCatePage: '//file.baixing.net/202105/609ea6ca5dc441be4501410db0509cfe.png', articleListPage: '//file.baixing.net/202105/1cdccfd92f8c5e86ae808e362cf2cd80.png', articleCatePage: '//file.baixing.net/202105/1cdccfd92f8c5e86ae808e362cf2cd80.png', aboutPage: '//file.baixing.net/202105/dac0b607fef01e3a1ebd03a440a1922a.png', contactPage: '//file.baixing.net/202105/dac0b607fef01e3a1ebd03a440a1922a.png' }
    const activeIcon = $('.drawer-nav-box .nav-item.active img')
    const position = activeIcon.data('position')
    activeIcon.attr('src', imgSrc[position])
  });
};

