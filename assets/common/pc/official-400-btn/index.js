import $ from "jquery";
import { eventTracker } from "../../tracker";
// import { get400Number } from "../../get400Number"


// 定时刷新倒计时
// const set400NumbertimeOut = function () {
//   let number = 180
//   const phoneNumTipText = $('.official-400-btn .official-nav-phone-num-tip>.tip-text')
//   const timer = setInterval(function () {
//     --number;
//     if (number > 0) {
//       phoneNumTipText.html(`电话${number}s后过期，刷新页面重新获取`)
//     } else { 
//       phoneNumTipText.html('电话已过期，刷新页面重新获取')
//       clearInterval(timer)
//     }
//   }, 1000)
// }

export const init400Btn = function () {
  $(document).on("ready", function () {
    const phoneNumBtn = $(".official-400-btn");
    const phoneNumText = $(".official-400-btn >span")
    // const phoneNumTip = $('.official-400-btn .official-nav-phone-num-tip')
    // const phoneNumTipText = $('.official-400-btn .official-nav-phone-num-tip>.tip-text')

    phoneNumBtn.on("click", async function (e) {
      // if (isSem === '1') {
      //   var union400num = $(this).data('union400num')
      //   if (union400num) {
      //     phoneNumText.text(union400num)
      //     phoneNumBtn.attr('disabled', true)
      //   } else {
      //     phoneNumBtn.attr('disabled', true)
      //     phoneNumBtn.attr('loading', true)
      //     const data = await get400Number()
      //     if (data.account) {
      //       phoneNumText.text(data.account)
      //       set400NumbertimeOut()
      //     } else {
      //       phoneNumTipText.text('号码获取失败，请联系客服')
      //       phoneNumBtn.attr('disabled', false)
      //     }
      //     phoneNumBtn.attr('loading', false)
      //     phoneNumTip.removeClass('hide')
      //   }
      // } else {
        var phone = $(this).data('phone')
        phoneNumText.text(phone)
        eventTracker("phone-pc", "vad-pc")
      // }
    });
  })
}