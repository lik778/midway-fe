import $ from 'jquery'

function copyToClip(content, message) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  alert(message || "复制成功");
}

export const initAboutus = function () {
  //等待DOM 结构加载完成，然后再执行操作
  $(document).on('ready', function () {
    const copyItems = $('.copy-data')
    copyItems.on('click', function () {
      const data = $(this).data('value')
      copyToClip(data)
    })
  })
}

