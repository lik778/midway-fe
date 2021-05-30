import $ from 'jquery'
import { semEventTracker } from '../../../../common/tracker';

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
  console.log(document.execCommand('copy'), 'execCommand');
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  document.activeElement.blur() 
  input.remove();
  alert( "微信号已复制成功,请打开微信添加");
};

export const footerContactModule = function(){
	$(document).on('ready',function(){
		const copyAddWechat = $('.wechat-box');
		copyAddWechat.on('click',function(){
			const data = $(this).data('value')
			if ( data != '' ){
				copyText(data, copyAddWechat)
      }
		})

		//点击底部浮层打点
		$(".online-box").click(()=>{
			semEventTracker("53kf-wap", "bottom-wap")
		});
		$(".wechat-box").click(()=>{
			semEventTracker("wechat-wap", "bottom-wap")
		});
		$(".phone-box").click(()=>{
			semEventTracker("phone-wap", "bottom-wap")
		})
	})
}

