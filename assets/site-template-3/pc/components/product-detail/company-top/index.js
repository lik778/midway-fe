import $ from 'jquery'

export const viewTel = function () {
    $(document).ready(function(){
        const telBtn = $(".telBtn");
        const telNum = telBtn.attr('href').slice(4)
        telBtn.click(()=>{
            $(".telBtn >span").text(telNum)
        })
    })
}