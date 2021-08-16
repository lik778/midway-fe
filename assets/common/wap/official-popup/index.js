
import $ from 'jquery';
import { eventTracker } from '../../tracker';

export const initPopup = () => {
  $(document).on('ready', function () {
    const popup = $(".official-popup-container")
    const gotoForm = $(".official-popup-container .right")
    const close = $('.official-popup-container .close')
    gotoForm.on('click', function () {
      popup.hide()
      eventTracker("popup-wap", "fixed-wap")
    })
    close.on('click', function () {
      popup.hide()
    })
  })
}
