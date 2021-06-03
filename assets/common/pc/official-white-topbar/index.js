import $ from 'jquery';

export const initTopbar = () => {
  $(document).on('ready', function () {
    const input = $('#inputValue')
    // 清除输入
    $('#searchClear').on('click', function () {
      input.val('')
    })

    $('#SearchBtn').on('click', function () {
      const shopDomain = $(this).data('shopdomain')
      const value = $.trim(input.val())
      window.location.href = `${shopDomain}search?key=${(value || '').toString()}`
    })
  })
}