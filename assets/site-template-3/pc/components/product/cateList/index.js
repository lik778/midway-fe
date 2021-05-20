import $ from 'jquery'

export const initCateList = () => {
  $(document).on('ready',()=>{
    const windowPath = window.location.pathname;
    $(".products-categories a").each((index, tab) => {
      const tabHref = $(tab).attr('href')
      if (tabHref.indexOf(windowPath) != -1) {
        $(tab).addClass('active')
      }
    })
  })
}
