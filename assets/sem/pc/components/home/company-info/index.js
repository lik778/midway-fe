import $ from 'jquery';

export const initCompanyInfo = () => {
  $(document).on('ready', function () {
    let hidden = true
    const companyDescText1 = $('.company-info .desc-text-1')
    const companyDescText2 = $('.company-info .desc-text-2')
    const companyActionBtn = $('.company-info .action-btn')
    companyActionBtn.on('click', function () {
      if (hidden) {
        companyDescText1.addClass('hide')
        companyDescText2.removeClass('hide')
        hidden = false
      } else {
        companyDescText1.removeClass('hide')
        companyDescText2.addClass('hide')
        hidden = true
      }
    })
  })
}