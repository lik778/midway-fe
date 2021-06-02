
import $ from 'jquery';

export const initRedTopbar = () => {
  $(document).on('ready', function () {
    $(".search-query").on("keypress", function(e) {
      var value = $.trim($(this).val());

    //当e.keyCode的值为13 即，点击前往/搜索 按键时执行以下操作
      if(e.keyCode == 13) {
        document.activeElement.blur();//软键盘收起
        window.location.href = `https://china.baixing.com/m/root/?query=${(value || '').toString()}`
      }
    });
  })
}
