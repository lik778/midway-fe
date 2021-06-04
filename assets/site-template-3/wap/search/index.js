// TODO Path alias
import { parseQuery, stringifyQuery } from '../../../common/utils'
import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { leaveLeads } from '../components/contact-form/index'
import { tabModule } from '../components/toptab/index';

leaveLeads()
tabModule()

const $ = (...args) => document.querySelector(...args)

// 切换 Tab 的逻辑
$('.search-type-tabs').onclick = e => {
  const $el = e.target
  const targetTab = $el?.dataset?.tab
  if (targetTab) {
    const { search, origin, pathname } = window.location
    const querys = parseQuery(search)
    querys.type = targetTab
    querys.page = 1
    window.location.href = origin + pathname + '?' + stringifyQuery(querys)
  }
}
