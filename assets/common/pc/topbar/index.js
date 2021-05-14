import $ from 'jquery';
export const topbarModule = function() {
    $(document).ready(function(){
      $('.topbar >.view').click(()=>{
        $('.topbar >.display-part').hide();
        $('.topbar >.display-all').show();
        $('.topbar >.view').hide();
      })
    })
}