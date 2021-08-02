import $ from 'jquery'

export const initProductListHot = function () {
  $(document).on('ready', function () {
    $('.product__btn').on('click', function (event) {
      event.preventDefault()
      event.stopPropagation()
      console.log(document.getElementById("footerPhoneBox"))
      document.getElementById("footerPhoneBox").click()
    })
  });
}