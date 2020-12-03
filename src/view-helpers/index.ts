import * as dayjs from 'dayjs'
import * as fs from 'fs';
import { join } from 'path';
import * as util  from './util';

export const setPugViewEngineHeplers = util.setPugViewEngineHeplers

export default {
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
  //这里定义了时间戳转换方法
  dateFormat: function(date: number) {
    return dayjs.unix(date).toJSON().substr(0, 10)
  }
}
