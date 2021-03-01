import $ from 'jquery'

export const scrollMore = function () {
 $(document).ready(function () {
    $(window).scroll(function () {
        const s = $(window).scrollTop()
        const h = $(window).height()
        const d = $(document).height()
        //console.log("s:",s,"h:",h,"d:",d);
        if((s+h+100) >= d){

        }
        function loadApi() {
        }
    })
    })
}
