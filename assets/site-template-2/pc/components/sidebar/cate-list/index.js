import $ from 'jquery'

export const cateListActive = function () {
    $(document).ready(function () {
        const windowPath = window.location.pathname;
        console.log("windowPath:",windowPath);
        $(".article").each((index,tab)=>{
            console.log($(tab).attr('href'));
            if ($(tab).attr('href').indexOf(windowPath) != -1){
                $(tab).addClass('category-active')
            }
        })
    })
}