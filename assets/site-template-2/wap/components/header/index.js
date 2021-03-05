import $ from 'jquery'

export const menusModule = function() {
  $('.back-icon').on('click', function(e) {
    history.back()
  })
}

