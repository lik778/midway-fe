import * as dayjs from 'dayjs'
export default {
  combineCss: function(text, options) {
    const { name } = options
    return `<link rel="stylesheet" href="/assets/${name}.css"/>`
  },
  dateFormat: function(text, options) {
    //console.log(options.date)
    const { newsTime } =options
    return
  }
}
