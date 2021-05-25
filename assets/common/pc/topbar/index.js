import $ from 'jquery';
import { eventTracker } from '../../tracker';

export const topbarModule = function() {
    $(document).on('ready',function(){
      //我要把它注释掉，因为头部改了。我又怕她反悔，所以先留着
      //$('.topbar >.view').on('click',()=>{
      //  eventTracker('phone-pc', 'top-pc');
      //  $('.topbar >.display-part').hide();
      //  $('.topbar >.display-all').show();
      //  $('.topbar >.view').hide();
      //})
      $('.topbar .link-right').on('click', ()=>{
        eventTracker('bx-kefu-pc', 'top-pc')
      })

      $('.topbar a:first-child').on('click', ()=>{
        eventTracker('bx-site-pc', 'top-pc')
      })
    })
}