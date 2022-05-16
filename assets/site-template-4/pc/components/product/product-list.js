import $ from 'jquery'

export const productList = () => {
  $('.productListP').on('mouseover',function() {
    console.log($('.productListP').data('hover'))
    $(this).css('background',$('.productListP').data('hover'))
  })
  $('.productListP').on('mouseout',function() {
    $(this).css('background','#fff')
  })
}