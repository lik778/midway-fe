import * as dayjs from 'dayjs'
import * as fs from 'fs';
import { join } from 'path';
import * as util  from './util';
import config from '../config';
export const setPugViewEngineHeplers = util.setPugViewEngineHeplers

export default {
  combine: function(text, options) {
    const { fileName } = options
    const handleArr =Array.isArray(fileName) ? [...fileName] : [ fileName ]
    let retAssets = ''
    if (handleArr.length === 0) return ''
    handleArr.forEach(item => {
        const name = item.split('.')[0]
        const suffix = item.split('.')[1]
        const readDir = fs.readdirSync(join(__dirname, '..', '../dist/public'));
        const cdnPath = config().cdnPath;
        const assetsName = readDir.find(x => x.includes(name) && x.includes(`.${suffix}`) && !x.includes('.map'))
        if(assetsName.indexOf('sem-home-pc') >-1){
          if (suffix === 'css') {
            retAssets += `<link rel="stylesheet" href="${cdnPath?'//shop.baixing.com':''}/assets/${assetsName}"/>`
          } else if (suffix === 'js') {
            retAssets += `<script src="${cdnPath?'//shop.baixing.com':''}/assets/${assetsName}"></script>`
          }
        }else{
          if (suffix === 'css') {
            retAssets += `<link rel="stylesheet" href="${cdnPath}/assets/${assetsName}"/>`
          } else if (suffix === 'js') {
            retAssets += `<script src="${cdnPath}/assets/${assetsName}"></script>`
          }
        }
       
    })
    return retAssets
  },
  //这里定义了时间戳转换方法
  dateFormat: function(date: number) {
    return dayjs.unix(date).toJSON().substr(0, 10)
  },
  dateFormat2: function(date: number) {
    return dayjs.unix(date).format('YYYY.MM.DD')
  }
}
