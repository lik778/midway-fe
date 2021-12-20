import $ from 'jquery'

export const cateListActive = function () {
    $(document).on('ready',function () {
        const windowPath = window.location.pathname.replace(/\/([\s\S]{0,})l(-?)([\s\S]{0,}).html/, '/$1$2$3');
        if (windowPath.indexOf('-') === -1) return
        $(".article").each((index,tab)=>{
            if ($(tab).attr('href').indexOf(windowPath) != -1){
                $(tab).addClass('category-active')
            }
        })
    })
}