import $ from 'jquery'

const BXMAINSITE = 'bxmainsite'
const BXMAINSITE_AUX = 'bxmainsite_aux'

const isWap = /android|iphone|ipod|ipad|micromessenger/i.test(navigator.userAgent);

export const eventTracker = (clickType, clickPosition) => {
  return new Promise((resolve, reject) => {
    $.post('/tracker', {
      eventType: BXMAINSITE,

      data: {
        event_type: BXMAINSITE,
        site_id: 'dianpu',
        shop_id: window.shopId,
        tracktype: 'event',
        action: 'click',
        clickType,
        clickPosition,
        src: window.trackSrc,
        _platform: isWap? 'wap' : 'pc',
        contentType: window.contentType,
        _ad: window.adId,
        category: '',
        refer: ''
      },
      //success: (res) => {//console.log(res)}
    })
  }).catch(err => {
    throw err;
  })
}

