import $ from 'jquery'

export const scrollMore = function () {
 $(document).ready(function () {
    $(window).scroll(function () {
        const s = $(window).scrollTop()
        const h = $(window).height()
        const d = $(document).height()
        const page = 1
        const totalPage = 2
        const pathname = window.location.pathname
        const baseUrl = pathname.indexOf("?")== -1 ? pathname : pathname.substring(0, pathname.indexOf("?"))
        console.log("pathName:",pathname);
        console.log(baseUrl);
        console.log("s:",s,"h:",h,"d:",d);
        if((s+h+100  ) >= d){
            page++
            $.ajax({
            })
        }
        function loadApi() {}
    })
    })
}
