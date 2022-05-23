import $ from 'jquery'

export const productList = function() {
  let $itemP = $('.item-p')
  let $itemPColor =  $itemP.data('color')
  $itemP.on('mouseover',function() {
    $(this).css('background-color',$itemPColor)
  })
  $itemP.on('mouseout',function() {
    $(this).css('background-color','#F6F6F6')
  })
 }