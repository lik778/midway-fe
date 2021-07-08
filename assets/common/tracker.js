import $ from 'jquery'

const BXMAINSITE = 'bxmainsite'
const BXMAINSITE_AUX = 'bxmainsite_aux'
const BANNER_ID_AICAIGOU = 1831
const BANNER_ID_SHANTOU = 2616
const BANNER_ID_SOGOU = 2192
const BANNER_ID_QIHU = 2195
const BANNER_ID_BAIDU = 2005
const BANNER_ID_SM = 2241
const BANNER_ID_BW = [2237]
const BANNER_ID_FM = [BANNER_ID_SOGOU, BANNER_ID_QIHU, BANNER_ID_BAIDU, BANNER_ID_SM]
const BANNER_ID_QC = [2280]
const isValidBannerID = id => [...BANNER_ID_FM, ...BANNER_ID_BW, ...BANNER_ID_QC, BANNER_ID_AICAIGOU, BANNER_ID_SHANTOU].includes(+id)

let host = 'localhost'
try {
  host = window.location.host
} catch (e) {
  console.log(e)
}
const isPro = host.indexOf('baixing.com') !== -1
const BASE_URL = isPro ? '//cloud.baixing.com.cn' : '//dev-api.baixing.cn'


// tips: 因为店铺也作为搜索通落地页，event事件需要兼容一下
export const getBaxSemEventField = () => {
  const opts = {}
  const query = parseQuery(window.location.search)
  const profiles = (query.profile || '').split('_')
  const groupId = query.group || ''
  const keyword = query.keyword || ''
  const [campaignId, oKeyword] = profiles
  opts.campaignId = campaignId || ''
  opts.keyword = keyword || oKeyword || ''
  opts.groupId = groupId
  opts.bannerId = query.bannerId || ''
  return opts
}

export const eventTracker = (clickType, clickPosition, action = 'click', extraData) => {
  const isWap = /android|iphone|ipod|ipad|micromessenger/i.test(navigator.userAgent);
  return new Promise((resolve, reject) => {
    $.post('/tracker', {
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        site_id: 'dianpu',
        shop_id: window.shopId,
        tracktype: 'event',
        action,
        clickType,
        clickPosition,
        src: window.trackSrc,
        _platform: isWap ? 'wap' : 'pc',
        contentType: window.contentType,
        _ad: window.adId,
        category: '',
        refer: document.referrer,
        refer_keywords: '', // 当前这个字段在click event下数据不明晰作用，暂时置空
        url: location.href,
        ...getBaxSemEventField(),
        ...extraData
      }
    })
  }).catch(err => { throw err })
}

export const semEventTracker = (clickType, clickPosition, action, remarks) => {
  const isWap = /android|iphone|ipod|ipad|micromessenger/i.test(navigator.userAgent);
  return new Promise((resolve, reject) => {
    $.post('/tracker', {
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        site_id: 'dianpu-sem',
        shop_id: window.shopId,
        tracktype: 'event',
        action,
        clickType,
        clickPosition,
        message: remarks,
        src: window.trackSrc,
        _platform: isWap ? 'wap' : 'pc',
        contentType: window.contentType,
        _ad: window.adId,
        category: '',
        refer: document.referrer,
        refer_keywords: '', // 当前这个字段在click event下数据不明晰作用，暂时置空
        url: location.href,
        ...getBaxSemEventField()
      },
      success: (res) => {
        resolve(res)
      },
      error: (res) => {
        reject(res)
      }
    })
  }).catch(err => { throw err })
}


const serializeParams = (params, options) => {
  if (options == null) options = {}
  const prefix = options.prefix != null ? options.prefix : ''
  let s = ''
  for (var key in params) {
    const value = params[key]
    if (typeof value === 'undefined') continue
    s += '&' + encodeURIComponent(prefix + key)
    if (value === null) continue
    s += '=' + encodeURIComponent(value)
  }
  return s.substring(1)
}

const parseQuery = (queryString) => {
  const query = {}
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
  for (var i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export const trackVisitor = (opts = {}) => {
  const isMobile = /Android|iPhone|iPad|micromessenger/i.test(navigator.userAgent)
  opts.refer = document.referrer.split('?')[0]
  if (!opts.refer) return
  opts.websiteUrl = location.href
  opts.device = isMobile ? 1 : 0
  const query = parseQuery(window.location.search)
  const profiles = (query.profile || '').split('_')
  const groupId = query.group
  const keyword = query.keyword || ''
  const [campaignId, oKeyword] = profiles
  opts.campaignId = campaignId
  opts.keyword = keyword || oKeyword
  opts.groupId = groupId
  if (!opts.campaignId) return
  const bannerId = query.bannerId
  if (BANNER_ID_FM.indexOf(+bannerId) > -1 && groupId === undefined) {
    return
  }
  if (!isValidBannerID(bannerId)) return
  else opts.bannerId = bannerId
  const img = new Image()
  img.src = BASE_URL + '/open/keyword-recommend-service/keyword/click-record?' + serializeParams(opts)
  img.style.display = 'none'
  document.body.appendChild(img)
}
