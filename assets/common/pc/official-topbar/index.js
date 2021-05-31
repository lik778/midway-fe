import $ from 'jquery';

export const initTopbar = () => {
  $(document).on('ready', function () {
    // const topbarPersenCenter = $('#topbarPersenCenter')
    // const topbarShopPromote = $('#topbarShopPromote')
    const topbarRegister = $('#topbarRegister')
    const topbarLogin = $('#topbarLogin')
    // const topbarHelp = $('#topbarHelp')
    const url = encodeURIComponent(window.location.href)
    topbarRegister.attr('href', `//www.baixing.com/oz/verify/reg?redirect=${url}`)
    topbarLogin.attr('href', `//www.baixing.com/oz/login?redirect=${url}`)


    $('#SearchBtn').on('click', function () {
      const value = $('#inputValue').val()
      window.location.href = `https://china.baixing.com/search/?query=${(value || '').toString()}`
    })
  })
}