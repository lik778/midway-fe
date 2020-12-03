import $ from 'jquery'

export const menusModule = function() {
  const HIDE_STATUS = 'none'
  const $navMenusEl = $('.nav-menus')

  //点击导航返回按钮
  $('.back-icon').on('click', function(e) {
    history.back()
  })

  $('.select-icon').on('click', function(e) {
      const status = $navMenusEl.css('display')
      if (status == HIDE_STATUS) {
        $navMenusEl.show()
      } else {
        $navMenusEl.hide()
      }
      $(document).one("click", function(){
        $navMenusEl.hide()
      })
      e.stopPropagation()
  })

  $navMenusEl.on("click", function(e){
    e.stopPropagation()
  })
}

