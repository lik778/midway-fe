
import $ from 'jquery';

export const initWhiteTopbar = () => {
  $(document).on('ready', function () {
    const input = $(".search-query")
    const searchBtn = $('#SearchBtn')

    // 搜索页需要预填充
    var query = decodeURIComponent(window.location.search.substring(1))
    var key = query.split("&").find(item => item && item.indexOf('key') !== -1)
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
      const value = $.trim(input.val())
      window.location.href = `${shopDomain}search?key=${(value || '').toString()}`
    })

    input.on("keypress", function (e) {
      //当e.keyCode的值为13 即，点击前往/搜索 按键时执行以下操作
      if (e.keyCode == 13) {
        const shopDomain = searchBtn.data('shopdomain')
        var value = $.trim(input.val());
        document.activeElement.blur();//软键盘收起
        window.location.href = `${shopDomain}search?key=${(value || '').toString()}`
      }
    });
  })
}
