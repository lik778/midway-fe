import * as dayjs from 'dayjs'
import * as fs from 'fs';
import { join } from 'path';
export default {
  combineCss: function(text, options) {
    const { name } = options
    return `<link rel="stylesheet" href="/assets/${name}.css"/>`
  },
  combine: function(text, options) {
    const { fileName } = options
    const name = fileName.split('.')[0]
    const suffix = fileName.split('.')[1]
    const readDir = fs.readdirSync(join(__dirname, '..', '../dist/public'));
    const assetsName = readDir.find(x => x.includes(name) && x.includes(`.${suffix}`) && !x.includes('.map'))
    if (suffix === 'css') {
      return `<link rel="stylesheet" href="/assets/${assetsName}"/>`
    } else if (suffix === 'js') {
      return `<script src="/assets/${assetsName}"></script>`
    }
  },
  dateFormat: function(text, options) {
     const { newsTime } = options
    //if(options.newsTime) text=dayjs.unix(newsTime).toJSON().substr(0, 10);
    return dayjs.unix(newsTime).toJSON().substr(0, 10)
  }
}
