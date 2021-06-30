import $ from 'jquery';

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
