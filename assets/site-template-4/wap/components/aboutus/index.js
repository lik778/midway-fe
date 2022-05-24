import $ from 'jquery'
import { eventTracker } from '../../../../common/tracker'

// input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
// 选择文本。createTextRange(setSelectionRange)是input方法
function selectText(textbox, startIndex, stopIndex) {
  if (textbox.createTextRange) {//ie
    const range = textbox.createTextRange();
    range.collapse(true);
    range.moveStart('character', startIndex);//起始光标
    range.moveEnd('character', stopIndex - startIndex);//结束光标
    range.select();//不兼容苹果
  } else {//firefox/chrome
    textbox.setSelectionRange(startIndex, stopIndex);
    textbox.focus();
  }
}

const copyText = (text, dom) => {
  // 数字没有 .length 不能执行selectText 需要转化成字符串
  const textString = text.toString();
  let input = document.createElement('input');
  input.setAttribute("value", text);
  input.setAttribute("readOnly", "readOnly");
  dom.append(input);

  input.value = textString;
  // ios必须先选中文字且不支持 input.select();
  selectText(input, 0, textString.length);
  //console.log(document.execCommand('copy'), 'execCommand');
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  document.activeElement.blur()
  input.remove();
};


const clickAction = ((dom) => {
  dom.on('click', function () {
    const data = $(this).data('value');
    copyText(data, dom);
    dom.css("color","#008000");
    dom.text('复制成功!');
    setTimeout(() => {
      dom.text('点击复制');
      dom.css("color","")
    }, 2000)
  })
})

export const initAboutus = function () {
  $(document).on('ready', function () {
    const expandBtn = $('#aboutus-click-to-expand');
    const expandContentSlice = $('.aboutus-content .aboutus-content-slice');
    const expandContentFull = $('.aboutus-content .aboutus-content-full');
    expandBtn.on('click',() => {
      if (expandContentSlice.hasClass('active')) {
        expandContentSlice.removeClass('active')
        expandContentFull.addClass('active')
        expandBtn.removeClass('active')
        expandBtn.html('点击收起')
      } else {
        expandContentSlice.addClass('active')
        expandContentFull.removeClass('active')
        expandBtn.addClass('active')
        expandBtn.html('点击展开')
      }
    })


    //复制微信号码
    const copyWechat = $('#wechat');
    clickAction(copyWechat);
    copyWechat.on('click',()=>{
      eventTracker('wechat-wap', 'company-info-wap')
    })

    $('.phone').on('click', ()=>{
      eventTracker('phone-wap', 'company-info-wap')
    })
  })
}
