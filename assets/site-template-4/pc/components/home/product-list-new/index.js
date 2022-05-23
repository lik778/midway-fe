import $ from 'jquery'

export const productListNew  = function() {
  let color =  $('.item-p-new').data('color')
  $('.item-p-new').on('mouseover',function() {
    $(this).css('background-color',color)
  })
  $('.item-p-new').on('mouseout',function() {
    $(this).css('background-color','#fff')
  })
}