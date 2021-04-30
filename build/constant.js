// 设备
const PC = 'pc'
const WAP = 'wap'
const DEVICE_TYPE = [PC, WAP]

// 模板名称
const TB_FUWU_TYPE = 1
const TB_B2B_TYPE = 2
const TB_B2C_TYPE = 3

// 模板页面名
const TB_BASE_PAGE_NAMES = ['home', 'news', 'news-detail', 'product', 'product-detail']
const TB_FUWU_PAGE_NAMES = [...TB_BASE_PAGE_NAMES, 'news-child', 'product-child']
const TB_B2B_PAGE_NAMES = [...TB_BASE_PAGE_NAMES]
const TB_B2C_PAGE_NAMES = [...TB_BASE_PAGE_NAMES]

module.exports = {
  DEVICE_TYPE,
  TB_FUWU_PAGE_NAMES,
  TB_B2B_PAGE_NAMES,
  TB_B2C_PAGE_NAMES,
  TB_FUWU_TYPE,
  TB_B2B_TYPE,
  TB_B2C_TYPE
}
