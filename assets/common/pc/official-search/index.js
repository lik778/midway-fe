
import $ from 'jquery';

export const initWhiteBlock = () => {
  $(document).on('ready', function () {
    $('#SearchBtn').on('click', function () {
      const value = $('#inputValue').val()
      window.location.href = `https://china.baixing.com/search/?query=${(value || '').toString()}`
    })
  })
}
