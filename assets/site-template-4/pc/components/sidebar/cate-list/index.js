import $ from 'jquery'

export const cateListActive = function () {
    $(document).on('ready',function () {
      const hover = $('.cateList').attr('detailHover')
      const curLocation = window.location.origin + window.location.pathname

      $('.cateList').each(function() {
        const curAttr = $(this).prop('href')
          if(curAttr === curLocation) {
            $(this).css({
              'color': hover,
              'fontWeight': 'bold'
            })
            $(this).find('.firstIcon').css('display','block')
            if($(this).position().top >= 341) {
              $(this).parent().animate({
                scrollTop: '341px'
              }, 'slow')
            } else if($(this).position().top >= 290) {
              $(this).parent().animate({
                scrollTop: '300px'
              }, 'slow')
            }
          } else {
            $(this).on('mouseover',function() {
              $(this).css('color',hover)
              $(this).find('.firstIcon').css('display','block')
            })
            $(this).on('mouseout',function() {
              $(this).css('color','#5D5D5D')
              $(this).find('.firstIcon').css('display','none')
            })
          }
      })
       
        const windowPath = window.location.pathname
        if (windowPath.indexOf('-') === -1) return
        $(".article").each((index,tab)=>{
            if ($(tab).attr('href').indexOf(windowPath) != -1){
                $(tab).addClass('category-active')
            }
        })
    })
}