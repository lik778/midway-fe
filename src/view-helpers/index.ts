import * as dayjs from 'dayjs'
import * as fs from 'fs';
import { join } from 'path';
import * as util from './util';
import config from '../config';
export const setPugViewEngineHeplers = util.setPugViewEngineHeplers

/* CDN 资源加载出错时的简单回退至加载源站 */

export const useScriptFallback = true
const cdnPath = config().cdnPath
const host = config().fuwu
const fallbackSource = fs.readFileSync(join(__dirname, './simple-resouce-reload.js'), { encoding: 'utf-8' })
  .replace(/('|")CDN_PATH('|")/, cdnPath)
  .replace(/('|")SOURCE_PATH('|")/, host)
// fs.writeFileSync(join(__dirname, './testfile.txt'), 'utf-8')
const fallbackFnInject = useScriptFallback
  ? `<style>\n${fallbackSource}\n</style>`
  : ''

export default {
  combine: function (text, options) {
    const { fileName } = options
    const handleArr = Array.isArray(fileName) ? [...fileName] : [fileName]
    let retAssets = `${fallbackFnInject}`
    if (handleArr.length === 0) return ''
    handleArr.forEach(item => {
      const name = item.split('.')[0]
      const suffix = item.split('.')[1]
      const readDir = fs.readdirSync(join(__dirname, '..', '../dist/public'));
      const cdnPath = config().cdnPath;
      const assetsName = readDir.find(x => x.includes(name) && x.includes(`.${suffix}`) && !x.includes('.map'))
      
      if (suffix === 'css') {
        retAssets += `\n<link rel="stylesheet" href="${cdnPath}/assets/${assetsName}" class="reload-css" onerror="simpleResourceReload('reload-css')" />`
      }
      if (suffix === 'js') {
        retAssets += `\n<script src="${cdnPath}/assets/${assetsName}" class="reload-js" onerror="simpleResourceReload('reload-js')"></script>`
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
