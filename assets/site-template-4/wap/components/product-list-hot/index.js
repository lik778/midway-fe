import $ from 'jquery'

export const initProductListHot = function () {
  $(document).on('ready', function () {
    $('.product__btn').on('click', function (event) {
      event.preventDefault()
      event.stopPropagation()
      document.getElementById("footerPhoneBox").click()
    })
  });
}