import $  from 'jquery'

export const productCat = function() {
  let cur = $('.item-category')
  let categoryColor =  $('.item-category').data('category')
  cur.on('mouseover',function() {
    $(this).css('color',categoryColor)
    $(this).find('.firstIcon').show()
  })
  cur.on('mouseout',function() {
    $(this).css('color','#5d5d5d')
    $(this).find('.firstIcon').hide()
  })
}