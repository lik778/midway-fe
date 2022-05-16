import $ from 'jquery'

export const newLists = function() {
  let theme = $('.newsTitle').data('hover')
  $('.newsTitle').on('mouseover',function() {
    $(this).css('color',theme)
  })
  $('.newsTitle').on('mouseout',function() {
    $(this).css('color','#212121')
  })
} 