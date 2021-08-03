import $ from 'jquery'
export const aboutUsNew = function () {
  $(document).on('ready', function () {
    var ininWordArr = [];//用来存储段落的文字
    var nowWordArr = [];//用来存储隐藏后所有段落的文字
    var initWordLength = $('.content-right-body').text().length//当前段落文字的长度
    console.log(initWordLength)
    var ininWord = $('.content-right-body').text()
    ininWordArr.push(ininWord)
    var nowWord
    if (initWordLength > 300) {
      nowWord = $('.content-right-body').text().substr(0, 300) + '......'
    } else {
      nowWord = $('.content-right-body').text()
      $('.view-detail').css('display','none')
    }
    $('.content-right-body').text(nowWord)
    nowWordArr.push(nowWord)
    $('.view-detail').on('click', function () {
      if ($(this).text() === '查看详情') {
        $('.view-detail').text(nowWordArr)
      }
    })

    // 点击显示电话号码
    $('.bottom-right').on('click', function () {
      $('.showphone').text('3057')
    })
  })
}