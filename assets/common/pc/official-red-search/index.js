
import $ from 'jquery';

export const initSearch = () => {
  $(document).on('ready', function () {
    const input = $('#inputValue')
    const searchBtn = $('#SearchBtn')

    // 搜索页需要预填充
    var query = decodeURIComponent(window.location.search.substring(1))
    var key = query.split("&").find(item => item && item.indexOf('key') !== -1);
    if (key) {
      const keyValue = key.split('=')[1]
      input.val(keyValue)
    }

    // 清除输入
    $('#searchClear').on('click', function () {
      input.val('')
    })

    searchBtn.on('click', function () {
      const shopDomain = $(this).data('shopdomain')
      const value = input.val()
      window.location.href = `${shopDomain}search?key=${(value || '').toString()}`
    })

    //回车事件绑定  
    $(document).on('keypress', function (event) {
      if (event.which == 13 || event.keyCode == "13") {
        const shopDomain = searchBtn.data('shopdomain')
        const value = $.trim(input.val())
        window.location.href = `${shopDomain}search?key=${(value || '').toString()}`
      }
    });
  })
}
