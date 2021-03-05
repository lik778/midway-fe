import $ from 'jquery'

export const viewTel = function () {
    $(document).ready(function(){
        const telBtn = $(".telBtn");
        const telNum = telBtn.attr('href').slice(4)
        console.log(telNum);
        telBtn.click(()=>{
            $(".telBtn >span").text(telNum)
        })
    })
}