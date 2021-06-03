
import $ from 'jquery';

export const initSearch = () => {
  $(document).on('ready', function () {
    $('#SearchBtn').on('click', function () {
      const shopDomain = $(this).data('shopdomain')
      const value = $('#inputValue').val()
      window.location.href = `${shopDomain}search?key=${value.toString()}`
    })
  })
}
