export default `
/** simpleResourceReload
 * 找到 link 或 script 资源，将 CDN 路径替换为源站路径并重新加载
 * @param {string} 元素的类选择器名称
 */
function simpleResourceReload(clsName) {
  try {
    const $reload = document.querySelector('.'+clsName)
    if (!$reload) {
      throw new Error('[ERR] resources loaded error:', clsName)
    }
    const tagname = $reload.tagName.toLowerCase()
    const isScript = tagname === 'script'
    const isStyle = tagname === 'link'
    const url = isScript ? $reload.src : isStyle ? $reload.href : ''
  
    // CDN origin
    const prefix = 'CDN_PATH'
    // 资源文件 origin
    const sourcePrefix = window.location.origin
  
    const staticPathReg = new RegExp('(https?:)?'+prefix+'(/.+)*$')
    const staticPath = url.match(staticPathReg)[2]
    const sourcePath = sourcePrefix + staticPath
  
    const $source = document.createElement(tagname)
    if (isScript) {
      $source.setAttribute('src', sourcePath)
    }
    if (isStyle) {
      $source.setAttribute('href', sourcePath)
      $source.setAttribute('rel', 'stylesheet')
    }
    $source.onload = () => simpleResourceReloadLog('[LOAD] resources reloaded: ' + clsName)
  
    document.head.appendChild($source)
  } catch(error) {
    simpleResourceReloadLog(error.message)
  }
}

function simpleResourceReloadLog(msg) {
  console.log(msg)
}
`