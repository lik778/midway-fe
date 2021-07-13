import * as dayjs from 'dayjs'
import * as fs from 'fs';
import { join } from 'path';
import * as util from './util';
import config from '../config';
export const setPugViewEngineHeplers = util.setPugViewEngineHeplers

/* CDN 资源加载出错时的简单回退至加载源站 */
const prefix = config().cdnPath
const host = config().fuwu
export const useScriptFallback = true
const scriptTagFallbackProps = useScriptFallback
  ? (clsName: string) => `class="${clsName}" onerror="simpleResourceReload('${clsName}')"`
  : () => ''
const scriptFallbackFunction = fs.readFileSync(join(__dirname, './simple-resouce-reload'), { encoding: 'utf-8' })
  .replace(/('|")PREFIX('|")/, prefix)
  .replace(/('|")PREFIX_SOURCE('|")/, host)
const scriptFallbackFunctionContents = useScriptFallback
  ? `<style>\n${scriptFallbackFunction}\n</style>`
  : ''

export default {
  combine: function (text, options) {
    const { fileName } = options
    const handleArr = Array.isArray(fileName) ? [...fileName] : [fileName]
    let retAssets = `${scriptFallbackFunctionContents}`
    if (handleArr.length === 0) return ''
    handleArr.forEach(item => {
      const name = item.split('.')[0]
      const suffix = item.split('.')[1]
      const readDir = fs.readdirSync(join(__dirname, '..', '../dist/public'));
      const cdnPath = config().cdnPath;
      const assetsName = readDir.find(x => x.includes(name) && x.includes(`.${suffix}`) && !x.includes('.map'))
      
      if (suffix === 'css') {
        retAssets += `\n<link rel="stylesheet" href="${cdnPath}/assets/${assetsName}" ${scriptTagFallbackProps('main-css')} />`
      }
      if (suffix === 'js') {
        retAssets += `\n<script src="${cdnPath}/assets/${assetsName}" ${scriptTagFallbackProps('main-js')}></script>`
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
