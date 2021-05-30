import $ from 'jquery';

export const initContactUs = () => {
  $(document).on('ready',function(){
    const contactUsAvatar = $('#contactUsAvatar')
    const logo = contactUsAvatar.data('src')
    contactUsAvatar.on('error', function () {
      $(this).addClass('hide')
      $('#defaultContactUsAvatar').removeClass('hide')
    })
    contactUsAvatar.attr('src',logo)
  })
}