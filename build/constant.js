const PC = 'pc'
const WAP = 'wap'
const DEVICE_TYPE = [PC, WAP]

// 模板页面名
const SITE_TEMPLATE_1_PAGE_NAMES = ['home', 'news', 'news-child',
  'news-detail', 'product', 'product-child', 'product-detail']
const SITE_TEMPLATE_2_PAGE_NAMES = SITE_TEMPLATE_1_PAGE_NAMES.concat(['about'])


module.exports = { DEVICE_TYPE, SITE_TEMPLATE_1_PAGE_NAMES, SITE_TEMPLATE_2_PAGE_NAMES  }
