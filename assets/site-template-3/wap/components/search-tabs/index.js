import $ from 'jquery'

export const initTabs = () => {
  $(document).on('ready', () => {
    var query = window.location.search.substring(1);
    var vars = query.split("&").filter(item => item && item.indexOf('page') === -1&&item.indexOf('type'));
    $(".search-type-tabs .item").on('click', function () {
      const type = $(this).data('type')
      vars.push(`type=${type}`)
      vars.push(`page=1`)
      var query = vars.join('&')
      window.location.href = `${window.location.pathname.split('?')[0]}?${query}`
    })
  })
}
