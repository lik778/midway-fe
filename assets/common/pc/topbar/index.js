import $ from 'jquery';
import { eventTracker } from '../../tracker';

export const topbarModule = function() {
    $(document).on('ready',function(){
      $('.topbar >.view').on('click',()=>{
        eventTracker('phone-pc', 'top-pc');
        $('.topbar >.display-part').hide();
        $('.topbar >.display-all').show();
        $('.topbar >.view').hide();
      })
    })
}