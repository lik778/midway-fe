import $ from 'jquery'

export const viewTel = function () {
    $(document).on('ready',function(){
        const telBtn = $(".telBtn");
        const telNum = telBtn.attr('href').slice(4)
        telBtn.on('click',()=>{
            $(".telBtn >span").text(telNum)
        })
    })
}