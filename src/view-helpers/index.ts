import * as dayjs from 'dayjs'
import * as fs from 'fs';
import { join } from 'path';
import * as util from './util';
import config from '../config';
export const setPugViewEngineHeplers = util.setPugViewEngineHeplers
const isLocal = process.env.NODE_ENV === 'local'

/* CDN 资源加载出错时的简单回退至加载源站，没有考虑加载顺序 */
export default {
  combine: function (text, options) {
    const { fileName } = options
    const handleArr = Array.isArray(fileName) ? [...fileName] : [fileName]
    let retAssets = ""
    if (handleArr.length === 0) return ''
    handleArr.forEach(item => {
      const name = item.split('.')[0]
      const suffix = item.split('.')[1]
      const readDir = fs.readdirSync(join(__dirname, '..', '../dist/public'));
      const cdnPath = config().cdnPath;
      const assetsName = isLocal ? readDir.find(x => x == item) : readDir.find(x => x.includes(name) && x.includes(`.${suffix}`) && !x.includes('.map'))
      if (assetsName) {
        if (suffix === 'css') {
          retAssets += `\n<link rel="stylesheet" href="${cdnPath}/assets/${assetsName}" onerror="changeOrigin(this,'css')" />`
        }
        if (suffix === 'js') {
          retAssets += `\n<script src="${cdnPath}/assets/${assetsName}" onerror="changeOrigin(this,'script')"></script>`
        }
      }
    })
    return retAssets
  },
  //这里定义了时间戳转换方法
  dateFormat: function (date: number) {
    return dayjs.unix(date).toJSON().substr(0, 10)
  },
  dateFormat2: function (date: number) {
    return dayjs.unix(date).format('YYYY.MM.DD')
  }
}
