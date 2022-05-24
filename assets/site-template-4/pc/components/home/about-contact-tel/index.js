import $ from 'jquery'

export function aboutContactTel() {
  $('#ConsultNow').on('mouseover',function() {
    console.log(window)
    $(this).prop('href',window.location.href.includes('contactFormBox') ? window.location.href : window.location.href + '#contactFormBox')
  })
}