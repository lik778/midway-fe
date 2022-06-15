import $ from 'jquery'

export const newLists = function() {
  let theme = $('.newsTitle').data('hover')
  let HoverArr = ['#showMoreBtn','.newsTitle']
  HoverArr.forEach(item =>  {
    $(item).on('mouseover',function() {
      if(item === '.newsTitle') {
        $(this).css('color',theme)
      }
      else {
        $(this).css({
          'background-color': theme
        })
        $(this).find('.set-color').css('color','#fff')
      }
    })
    $(item).on('mouseout',function() {
      if(item === '.newsTitle') {
        $(this).css('color','#212121')
      }
      else {
        $(this).css({
          'background-color': '#fff'
        })
        $(this).find('.set-color').css('color','#666')
      }
    })
  })
} 