import $ from 'jquery'

export const initCateList = () => {
  $(document).on('ready', () => {
    // 这里的匹配有问题  /p-1  能匹配到 /p-11 /p-111  不过一个用户的类目基本上连续  不怎么可能出现那种情况 不用管咯
    const windowPath = window.location.pathname.replace(/\/([\s\S]{0,})l(-?)([\s\S]{0,}).html/, '/$1$2$3');
    if (windowPath.indexOf('-') === -1) return
    $(".products-categories a").each((index, tab) => {
      const tabHref = $(tab).attr('href')
      if (tabHref.indexOf(windowPath) != -1) {
        $(tab).addClass('active')
      }
    })
  })
}
