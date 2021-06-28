import $ from 'jquery'
import { get400Number } from '../../get400Number'
 
// 定时刷新倒计时
const set400NumbertimeOut = function () {
  let number = 180
  const phoneNumTipText = $('.header-bgc .phone-num-box>.phone-num-tip>.tip-text')
  const timer = setInterval(function () {
    --number;
    if (number > 0) {
      phoneNumTipText.html(`电话${number}s后过期，刷新页面重新获取`)
    } else {
      console.log(phoneNumTipText)
      phoneNumTipText.html('电话已过期，刷新页面重新获取')
      clearInterval(timer)
    }
  }, 1000)
}

export const initPhone = function () {
  $(document).on('ready', async function () {
    // 如果是sem页面 有点击显示电话功能
    if (isSem) {
      const phoneNumBox = $('.header-bgc .phone-num-box')
      const phoneNum = $('.header-bgc .phone-num-box>.phone-num')
      const phoneNumTip = $('.header-bgc .phone-num-box>.phone-num-tip')
      const phone400Action = $('.header-bgc .phone-400-action')
      const phone400ActionBtn = $('.header-bgc .phone-400-action .btn')
      phone400ActionBtn.on('click', async function (e) {
        var union400num = $(this).data('union400num')
        if (union400num) {
          phoneNumBox.removeClass('hide')
          phone400Action.addClass('hide')
        } else {
          phone400ActionBtn.attr('disabled', true)
          phone400ActionBtn.attr('loading', true)
          const data = await get400Number()
          phoneNum.text(data.account)
          phoneNumBox.removeClass('hide')
          phoneNumTip.removeClass('hide')
          phone400Action.addClass('hide')
          set400NumbertimeOut()
        }
      })
    }
  })
}
