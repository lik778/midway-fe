export default {
  combineCss: function(text, options) {
    const { name } = options
    return `<link rel="stylesheet" href="/assets/${name}.css"/>`
  },
  dateFormat: function(text, options) {
    console.log(options.date)
    return '2020-09-01'
  }
}
