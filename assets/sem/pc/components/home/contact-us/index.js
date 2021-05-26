import $ from 'jquery';

export const initContactUs = () => {
  $('#contactUsAvatar').on('error', function () {
    $(this).addClass('hide')
    $('#defaultContactUsAvatar').removeClass('hide')
  })
}