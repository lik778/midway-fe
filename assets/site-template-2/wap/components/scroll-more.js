import $ from 'jquery'

export const scrollMore = function () {
 $(document).ready(function () {
    const pathname = window.location.pathname
    const baseUrl = pathname.indexOf("?")== -1 ? pathname : pathname.substring(0, pathname.indexOf("?"))
    let page = parseInt(window.location.search.slice(6) || 1)
    console.log("page:",page);
    console.log("pathName:",pathname);
    console.log(baseUrl);
    const nextPage = function() {
        //window.open(`${baseUrl}?page=${page}`);
    }


    $(window).scroll(function () {
        const s = $(window).scrollTop()
        const h = $(window).height()
        const d = $(document).height()

        if((s+h+100 )>= d){
            if(true){
                page ++;
                setTimeout(nextPage(),150)
            }
        }
        })
    })
}
