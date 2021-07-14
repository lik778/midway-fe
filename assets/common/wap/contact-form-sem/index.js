import $ from 'jquery';



const setForm = (contactForm, contactFormParent, formA) => {
  // sem部分链接需要禁止二跳
  const contactFormSem = $('#contactFormSem')
  const contactFormContent = $('#contactFormContent')
  const contactFormSemClose = $('#contactFormSemClose')
  const htmlDom = $('html')

  function gotoContactUs(e) {
    e.preventDefault()
    contactFormContent.append(contactForm)
    contactFormSem.css('top', '0')
    htmlDom.css('overflow', 'hidden')
  }
  formA.on('click', gotoContactUs)

  contactFormSem.on('click', function (e) {
    if (contactFormSemClose.is(e.target) || (!contactFormContent.is(e.target) && contactFormSem.is(e.target))) {
      contactFormParent.append(contactForm)
      contactFormSem.css('top', '-100vh')
      htmlDom.css('overflow', 'visible')
    }
  });
}

function gotoDetail(e) {
  e.preventDefault()
  const href = $(this).attr('href')
  const target = $(this).attr('target')
  if (href.indexOf('?') !== -1) {
    window.open(`${href}&sem=1`, target,)
  } else {
    window.open(`${href}?sem=1`, target,)
  }
}

// 这玩意确实可以和wap公用 但是不知道放哪个文件夹，还是算了 
export const initSem = function ({ contactForm, contactFormParent, formA, gotoDetailA }) {
  // 不跳转的链接则谈窗
  setForm(contactForm, contactFormParent, formA)
  // 跳转的链接则加上sem=1的参数
  gotoDetailA && gotoDetailA.on('click', gotoDetail)
}
