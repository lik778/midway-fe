import $ from 'jquery'
//import { debug } from 'node:console';
import { eventTracker } from '../../../../../common/tracker';

export const viewTel = function () {
    $(document).on('ready',function(){
        const telBtn = $(".telBtn");
        const telNum = telBtn.attr('href').slice(4);
        telBtn.on('click',()=>{
            $(".telBtn >span").text(telNum)
            eventTracker('phone-pc', 'vad-pc')
        });
        $('.online-btn').on('click',()=>{
            eventTracker('53kf-pc", "vad-pc')
        });
    })
}