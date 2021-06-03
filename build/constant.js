// 设备
const PC = 'pc'
const WAP = 'wap'
const DEVICE_TYPE = [PC, WAP]

// 模板_类型_B2C/B2B_序号
const TB_TYPE_B2C_1 = 1
const TB_TYPE_B2B_2 = 2
const TB_TYPE_B2C_3 = 3

// 模板_页面名称_B2C/B2B_序号。
const TB_BASE_PAGE_NAMES = ['home', 'news', 'news-detail', 'product', 'product-detail']
const TB_PAGE_NAMES_B2C_1 = [...TB_BASE_PAGE_NAMES, 'news-child', 'product-child']
const TB_PAGE_NAMES_B2B_2 = [...TB_BASE_PAGE_NAMES, 'about', 'search']
const TB_PAGE_NAMES_B2C_3 = [...TB_BASE_PAGE_NAMES, 'about', 'search']

module.exports = {
  DEVICE_TYPE,
  TB_PAGE_NAMES_B2C_1,
  TB_PAGE_NAMES_B2B_2,
  TB_PAGE_NAMES_B2C_3,
  TB_TYPE_B2C_1,
  TB_TYPE_B2B_2,
  TB_TYPE_B2C_3
}
