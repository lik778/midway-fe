import $ from 'jquery'

export const productList = () => {
  $('.item-p').each(function() {
    $(this).on('mouseover',function() {
      $(this).find('.productListP').css('background',$('.productListP').data('hover'))
    })
    $(this).on('mouseout',function() {
      $(this).find('.productListP').css('background','#fff')
    })
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