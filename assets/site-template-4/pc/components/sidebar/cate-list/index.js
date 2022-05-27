import $ from 'jquery'

export const cateListActive = function () {
    $(document).on('ready',function () {
       let hover = $('.cateList').attr('detailHover')
       $('.cateList').on('mouseover',function() {
         $(this).css('color',hover)
         $(this).find('.firstIcon').css('display','block')
       })
       $('.cateList').on('mouseout',function() {
        $(this).css('color','#5D5D5D')
        $(this).find('.firstIcon').css('display','none')
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