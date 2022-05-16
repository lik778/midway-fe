import $ from 'jquery'
export const seflAdvantage = function() {
  let color = $('.advanItem').data('hover')
  let titleColor = $('.advanItem .title').data('title')
  console.log(titleColor)
  $('.advanItem').on('mouseover',function(e) {
    $(this).css('background-color',color)
    $(this).find('.title').css('color','#fff')
    $(this).find('.content').css('color','#fff')
  })
  $('.advanItem').on('mouseout',function() {
    $(this).css('background-color','#fff')
    $(this).find('.title').css('color',titleColor)
    $(this).find('.content').css('color','#5D5D5D')
  })
}