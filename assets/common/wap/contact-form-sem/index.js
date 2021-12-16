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

function gotoDetail(e, sem, account) {
  e.preventDefault()
  let href = $(e.currentTarget).attr('href')
  if (!href) return
  const target = $(e.currentTarget).attr('target') || '_self'
  const contactForm = '#contactForm'
  const hasContactForm = href.indexOf(contactForm)
  href = href.replace(contactForm, '')
  if (hasContactForm !== -1) {
    window.open(`${href}?sem=${sem}&account=${account}${contactForm}`, target,)
  } else {
    if (href.indexOf('?') !== -1) {
      window.open(`${href}&sem=${sem}&account=${account}`, target,)
    } else {
      window.open(`${href}?sem=${sem}&account=${account}`, target,)
    }
  }
}

function disable(e) {
  e.preventDefault()
  window.open(`#`, target,)
}

// 这玩意确实可以和wap公用 但是不知道放哪个文件夹，还是算了 
/**
 * 
 * @param {*} type home/detail 是首页还是详情页
 * @param {*} contactForm 是首页 需要有留咨弹窗
 * @param {*} contactFormParent 是首页 需要有留咨弹窗的父节点
 * @param {*} formA 是首页 需要展示留咨弹窗的a标签
 * @param {*} gotoOtherPageA 需要前往详情页的a标签
 * @param {*} disableA 被禁用的a标签
 */
export const initSem = function ({ account, sem, type, contactForm, contactFormParent, formA, gotoOtherPageA, disableA }) {
  console.log(sem)
  if (sem === "1") {
    // 不跳转的链接则谈窗
    if (type === 'home') {
      setForm(contactForm, contactFormParent, formA)
    }

    // 跳转的链接则加上sem的参数
    gotoOtherPageA && gotoOtherPageA.on('click', function (e) {
      gotoDetail(e, sem, account)
    })

    // 被禁用的a标签点击无反应
    disableA && disableA.on('click', disable)
  } else if (sem === "2") {
    // 跳转的链接则加上sem的参数
    gotoOtherPageA && gotoOtherPageA.on('click', function (e) {
      gotoDetail(e, sem, account)
    })
  }
}
