import $ from 'jquery';

export const initCompanyInfo = () => {
  $(document).on('ready', function () {
    const companyDescText = $('.company-info .desc-text')
    const companyActionBtn = $('.company-info .action-btn ')
    companyActionBtn.on('click', function () {
      if (companyDescText.hasClass('hide')) {
        companyDescText.removeClass('only-twoline hide')
        companyActionBtn.text('收起')
      } else {
        companyDescText.addClass('only-twoline hide')
        companyActionBtn.text('展开')
      }
    })
  })
}