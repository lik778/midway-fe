
import $ from 'jquery';

export const initRedTopbar = () => {
  $(document).on('ready', function () {
    const input = $(".search-query")

    // 搜索页需要预填充
    var query = decodeURIComponent(window.location.search.substring(1))
    var key = query.split("&").find(item => item && item.indexOf('key') !== -1)
    if (key) {
      const keyValue = key.split('=')[1]
      input.val(keyValue)
    }

    input.on("keypress", function(e) {
      var value = $.trim($(this).val());
      const shopDomain = $(this).data('shopdomain')
    //当e.keyCode的值为13 即，点击前往/搜索 按键时执行以下操作
      if(e.keyCode == 13) {
        document.activeElement.blur();//软键盘收起
        window.location.href = `${shopDomain}search?key=${(value || '').toString()}`
      }
    });
  })
}
