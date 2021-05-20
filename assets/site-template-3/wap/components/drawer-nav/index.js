import $ from 'jquery'

export const initNav = function () {
  const navSelectIcon = $('.nav-select-icon')
  const drawerNavBox = $('.drawer-nav-box')
  const drawerNavMask = $('.drawer-nav-mask')
  const body = $('body')
  const html = $('html')
  body.css({ transition: "all 0.5s" });

  navSelectIcon.on('click', function () {
    navSelectIcon.addClass('active')
    drawerNavBox.addClass('active')
    drawerNavMask.addClass('active')
    body.css({ transform: 'translateX(-180px)' });
    html.css({ width: '100vw', height: '100vh', overflow: 'hidden' })
  })
  drawerNavMask.on('click', function () {
    navSelectIcon.removeClass('active')
    drawerNavBox.removeClass('active')
    drawerNavMask.removeClass('active')
    body.css({ transform: '' });
    html.css({ width: 'auto', height: 'auto', overflow: 'visible' })
  })

  const imgSrc = {
    0: '//file.baixing.net/202105/ebad606fef0001ec73d15fc4e51921c4.png',
    1: '//file.baixing.net/202105/609ea6ca5dc441be4501410db0509cfe.png',
    2: '//file.baixing.net/202105/1cdccfd92f8c5e86ae808e362cf2cd80.png',
    3: '//file.baixing.net/202105/dac0b607fef01e3a1ebd03a440a1922a.png',
  }
  $(document).on('ready', function () {
    const windowHref = window.location.href.indexOf('-') !== -1 ? window.location.href.split('-')[0] : window.location.href
		const windowPath = window.location.pathname.indexOf('-') !== -1 ? window.location.pathname.split('-')[0] : window.location.pathname
    $(".nav-item").each((index, tab) => {
      const tabHref = $(tab).attr('href');
			console.log(tabHref, windowHref, windowPath)
			if (tabHref === windowHref || tabHref.indexOf(windowHref) !== -1 || tabHref.indexOf(windowPath) !== -1) {
        $(tab).addClass('active')
        const imgList = $(tab).find('img')
        if (imgList && imgList.length > 0) {
          $(imgList[0]).attr('src', imgSrc[index])
        }
      }
    })
  })
}
