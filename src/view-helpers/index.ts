import * as dayjs from 'dayjs'
export default {
  combineCss: function(text, options) {
    const { name } = options
    return `<link rel="stylesheet" href="/assets/${name}.css"/>`
  },
  dateFormat: function(text, options) {
     const { newsTime } = options
    //if(options.newsTime) text=dayjs.unix(newsTime).toJSON().substr(0, 10);
    return dayjs.unix(newsTime).toJSON().substr(0, 10)
  }
}
