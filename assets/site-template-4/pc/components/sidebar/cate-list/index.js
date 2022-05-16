import $ from 'jquery'

export const cateListActive = function () {
    $(document).on('ready',function () {
       let hover = $('#cateList').data('hover')
       $('#cateList').on('mouseover',function() {
         $(this).css('color',hover)
         $('.firstIcon').css('display','block')
       })
       $('#cateList').on('mouseout',function() {
        $(this).css('color','#5D5D5D')
        $('.firstIcon').css('display','none')
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