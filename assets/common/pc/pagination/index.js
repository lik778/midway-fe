import $ from 'jquery';

const initPagination = () => {
  $(document).on('ready', function () {
    var query = window.location.search.substring(1);
    var vars = query.split("&").filter(item => item && item.indexOf('page') === -1);
    $('.page-item').on('click', function () {
      var page = $(this).data('page')
      vars.push(`page=${page}`)
      var query = vars.join('&')
      window.location.href = `${window.location.pathname.split('?')[0]}?${query}`
    })
  })
}

initPagination()