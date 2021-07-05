import $ from 'jquery'
import { eventTracker } from '../../tracker';
import { get400Number } from '../../get400Number'

// 定时刷新倒计时
const set400NumbertimeOut = function () {
  let number = 180
  const timeTip = $('.footer-phone-box .time-tip')
  const timer = setInterval(function () {
    --number;
    if (number > 0) {
      timeTip.text(`${number}s后更新`)
    } else {
      timeTip.text(`电话过期请刷新`)
      clearInterval(timer)
    }
  }, 1000)
}

export const initPhone = function () {
  $(document).on('ready', async function () {
    // 如果是sem页面 有点击显示电话功能
    const footerPhoneBox = $('.footer-phone-box')
    footerPhoneBox.on("click", () => {
      eventTracker("phone-wap", "bottom-wap")
    })

    if (isSem) {
      const footerPhoneSemBtn = $('.footer-phone-sem-box')
      const phoneNum = $('.footer-phone-box .phone-num')
      const timeTip = $('.footer-phone-box .time-tip')
      footerPhoneSemBtn.on('click', async function (e) {
        eventTracker("phone-wap", "bottom-wap")
        var union400num = $(this).data('union400num')
        if (union400num) {
          footerPhoneBox.removeClass('hide')
          footerPhoneSemBtn.addClass('hide')
        } else {
          footerPhoneSemBtn.attr('disabled', true)
          footerPhoneSemBtn.attr('loading', true)
          const data = await get400Number()
          union400num = data.account
          phoneNum.text(data.account)
          footerPhoneBox.attr('href', "tel:" + union400num)
          footerPhoneBox.removeClass('hide')
          timeTip.removeClass('hide')
          footerPhoneSemBtn.addClass('hide')
          set400NumbertimeOut()
        }
        window.location.href = `tel:${union400num}`
      })
    }
  })
}
