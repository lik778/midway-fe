import $ from 'jquery'

export const contactMessage = () => {
  
  $(document).on('ready',() => {
    const CompanyTitle = $('#companyTitle')
    const CompanyIcon = $('#companyTitle .company-icon')
    const CompanyContect = $('#companyTitle .company-contect')
    const text = CompanyContect.text()
    if(text && text.length >= 21) {
      CompanyTitle.on('mouseover',() => {
        CompanyIcon.css('display','block')
        CompanyTitle.css('cursor','pointer')
      })
      CompanyTitle.on('mouseout',() => {
        CompanyIcon.css('display','none')
      })
    }
    const colors = $('.navPage').data('hover')
    $('.navPage').on('mouseover',function() {
      $(this).css('color',colors)
    })
    $('.navPage').on('mouseout',function() {
      $(this).css('color','#fff')
    })
  })  
}