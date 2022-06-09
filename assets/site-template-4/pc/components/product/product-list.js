import $ from 'jquery'

export const productList = () => {
  $('.productListP').on('mouseover',function() {
    $(this).css('background',$('.productListP').data('hover'))
  })
  $('.productListP').on('mouseout',function() {
    $(this).css('background','#fff')
  })
  $('.item-p').find('.play-icon').each(function() {
    $(this).on('click',function(event) {
      event.stopPropagation()
      if($(this).find('video').paused) {
        $(this).find('video').play()
        $(this).hide()
      } else {
        $(this).find('video').paused()
        $(this).show()
      }
    })
  })
}