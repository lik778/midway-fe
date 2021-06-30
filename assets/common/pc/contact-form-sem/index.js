import $ from 'jquery';
// 这玩意确实可以和wap公用 但是不知道放哪个文件夹，还是算了 
export const initContactFormSem = function (contactForm, contactFormParent, allA) {
  // sem需要禁止二跳
  const contactFormSem = $('#contactFormSem')
  const contactFormContent = $('#contactFormContent')
  const htmlDom = $('html')
  function gotoContactUs(e) {
    e.preventDefault()
    contactFormContent.append(contactForm)
    contactFormSem.css('top', '0')
    htmlDom.css('overflow', 'hidden')
  }

  allA.on('click', gotoContactUs)

  contactFormSem.on('click', function (e) {
    if (!contactFormContent.is(e.target) && contactFormSem.is(e.target)) {
      contactFormParent.append(contactForm)
      contactFormSem.css('top', '-100vh')
      htmlDom.css('overflow', 'visible')
    }
  });
}
