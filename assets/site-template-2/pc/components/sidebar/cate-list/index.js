import $ from 'jquery'

export const cateListActive = function () {
    $(document).on('ready',function () {
        const windowPath = window.location.pathname;
        $(".article").each((index,tab)=>{
            if ($(tab).attr('href').indexOf(windowPath) != -1){
                $(tab).addClass('category-active')
            }
        })
    })
}