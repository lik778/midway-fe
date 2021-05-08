import $ from 'jquery'

$('.select-icon').on('click',function(){
  alert('1111')
  var className = $(this).attr('class')
  if(className.indexOf('active')!==-1){
    $(this).removeClass('active')
  }else{
    $(this).addClass('active')
  }
})