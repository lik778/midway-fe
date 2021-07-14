import $ from 'jquery'
import { get400Number } from '../../get400Number'

// 定时刷新倒计时
const set400NumbertimeOut = function () {
  let number = 180
  const phoneNumTipText = $('.official-nav-phone-block .official-nav-phone-num-tip>.tip-text')
  const timer = setInterval(function () {
    --number;
    if (number > 0) {
      phoneNumTipText.html(`电话${number}s后过期，刷新页面重新获取`)
    } else { 
      phoneNumTipText.html('电话已过期，刷新页面重新获取')
      clearInterval(timer)
    }
  }, 1000)
}

export const initPhone = function () {
  $(document).on('ready', async function () {
    // 如果是sem页面 有点击显示电话功能
    if (isSem) {
      const phoneNumBox = $('.official-nav-phone-block .official-nav-phone-num-box')
      const phoneNum = $('.official-nav-phone-block .official-nav-phone-num-box>.official-nav-phone-num')
      const phoneNumTip = $('.official-nav-phone-block .official-nav-phone-num-tip')
      const phone400Action = $('.official-nav-phone-block .official-nav-phone-400-action')
      const phone400ActionBtn = $('.official-nav-phone-block .official-nav-phone-400-action .btn')
      const phoneNumTipText = $('.official-nav-phone-block .official-nav-phone-num-tip>.tip-text')
      phone400ActionBtn.one('click', async function (e) {
        var union400num = $(this).data('union400num')
        if (union400num) {
          phoneNumBox.removeClass('hide')
          phone400Action.addClass('hide')
        } else {
          phone400ActionBtn.attr('disabled', true)
          phone400ActionBtn.attr('loading', true)
          const data = await get400Number()
          if (data.account) {
            phoneNum.text(data.account)
            phoneNumBox.removeClass('hide')
            phoneNumTip.removeClass('hide')
            phone400Action.addClass('hide')
            set400NumbertimeOut()
          } else {
            phoneNumTip.removeClass('hide')
            phoneNumTipText.html('号码获取失败，请联系客服')
          }
          phone400ActionBtn.attr('disabled', false)
          phone400ActionBtn.attr('loading', false)
        }
      })
    }
  })
}
 