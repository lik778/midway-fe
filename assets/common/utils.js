/**
 * 将 Query String 解析为 Object
 */
export function parseQuery (queryString) {
  const query = {}
  const pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&')

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }

  return query
}

/**
 * Query Object 序列化
 */
export function stringifyQuery (res, separator = '&') {
  if (typeof res === 'string') return res
  if (typeof res !== 'object') return ''

  return Object
    .entries(res)
    .reduce((curr, [key, val]) => {
      return curr.concat(`${key}=${val}`)
    }, [])
    .join(separator)
}

export const utils = {
  parseQuery,
  stringifyQuery
}
