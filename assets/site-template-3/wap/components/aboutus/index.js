import $ from 'jquery'

function copyToClip(content, name) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

const clickAction = ((dom)=>{
  dom.on('click', function () {
    const data = $(this).data('value');
    copyToClip(data);
    dom.text('复制成功！');
    setTimeout(()=>{
      dom.text('点击复制');
    },2000)
  })
 })

export const initAboutus = function () {
  //等待DOM 结构加载完成，然后再执行操作
  $(document).on('ready', function () {
    const copyWechat = $('.wechat');
    clickAction(copyWechat);
  })
}


