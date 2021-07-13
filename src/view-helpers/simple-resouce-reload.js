function simpleResourceReload(clsName) {
  const $reload = document.querySelector(`.${clsName}`)
  if (!$reload) {
    throw new Error('[ERR] resources loaded error:', clsName)
  }
  const tagname = $reload.tagName.toLowerCase()
  const isScript = tagname === 'script'
  const isStyle = tagname === 'link'
  const url = isScript ? $reload.src : isStyle ? $reload.href : ''

  const prefix = "PREFIX"
  const staticPathReg = new RegExp(`${prefix}(/.+)*$`)
  const staticPath = url.match(staticPathReg)[1]
  const sourcePrefix = "PREFIX_SOURCE"
  const sourcePath = sourcePrefix + staticPath

  const $source = document.createElement(tagname)
  if (isScript) {
    $source.setAttribute('src', sourcePath)
  }
  if (isStyle) {
    $source.setAttribute('href', sourcePath)
    $source.setAttribute('rel', 'stylesheet')
  }
  $source.onload = () => simpleResourceReloadLog(clsName)

  document.head.appendChild($source)
}

function simpleResourceReloadLog(clsName) {
  console.log('[LOAD] resources reloaded:', clsName)
}