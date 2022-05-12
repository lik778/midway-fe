import $ from 'jquery'
import { eventTracker } from '../../tracker';

export const initPhone = function () {
  $(document).on('ready', async function () {
    // 如果是sem页面 有点击显示电话功能
    const footerPhoneBox = $('.footer-phone-box')
    footerPhoneBox.on("click", () => {
      eventTracker("phone-wap", "bottom-wap")
    })
  })
}
