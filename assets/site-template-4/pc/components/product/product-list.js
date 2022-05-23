import $ from 'jquery'

export const productList = () => {
  $('.productListP').on('mouseover',function() {
    $(this).css('background',$('.productListP').data('hover'))
  })
  $('.productListP').on('mouseout',function() {
    $(this).css('background','#fff')
  })
}