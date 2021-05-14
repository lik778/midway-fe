import $ from 'jquery'

function copyToClip(content, dom) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  dom.append(aux);
  aux.select();
  document.execCommand("copy");
  aux.remove();
}

const clickAction = ((dom)=>{
  dom.on('click', function () {
    const data = $(this).data('value');
    copyToClip(data, dom);
    dom.text('复制成功！');
    setTimeout(()=>{
      dom.text('点击复制');
    },2000)
  })
 })

export const initAboutus = function () {
  $(document).on('ready', function () {
    //复制微信号码
    const copyWechat = $('#wechat');
    clickAction(copyWechat);
  })
}



