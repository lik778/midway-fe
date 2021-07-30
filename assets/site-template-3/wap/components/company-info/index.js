import $ from 'jquery';

export const initCompanyInfo = () => {
  $(document).on('ready', function () {
    const companyDescText = $('.company-info .desc-text')
    const companyActionBtn = $('.company-info .action-btn ')
    if (companyDescText.outerHeight() > 60) {
      companyDescText.addClass('only-threeline hide')
      companyActionBtn.removeClass('hide')
    }
    companyActionBtn.on('click', function () {
      if (companyDescText.hasClass('hide')) {
        companyDescText.removeClass('only-threeline hide')
        companyActionBtn.text('收起')
      } else {
        companyDescText.addClass('only-threeline hide')
        companyActionBtn.text('展开')
      }
    })
  })
}