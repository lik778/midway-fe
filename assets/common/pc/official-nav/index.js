// import  $ from 'jquery'

// $('.nav-item-box .maskLayer-htek').on('click',function(e) {
//   // e.cancelBubble=true
//   // e.preventDefault ? e.preventDefault() : e.returnValue = false
//   let locationUrl = location.href
//   let exitPinZhuanUrl1 = locationUrl.includes('?special=baidu_pinzhuan&')  // 头部后面有其他参数
//   let exitPinZhuanuRL2  = locationUrl.includes('&special=baidu_pinzhuan') // 中间和尾部
//   let url = ''
//   if(exitPinZhuanUrl1) {
//     url =  locationUrl.replace('?special=baidu_pinzhuan&','?')
//   } else if(exitPinZhuanuRL2) {
//     url =  locationUrl.replace('&special=baidu_pinzhuan','')
//   } else {
//     url = locationUrl.replace('special=baidu_pinzhuan','') // 头部后面没有其他参数
//   }
//   location.href = url
// })