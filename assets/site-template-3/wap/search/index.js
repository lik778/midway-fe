import './index.styl'
import '../layout/index'
import '../components/swiper/index'
import { leaveLeads } from '../components/contact-form/index'
import { tabModule } from '../components/toptab/index';

leaveLeads()
tabModule()

const $ = (...args) => document.querySelector(...args)

$('.search-type-tabs').onclick = e => {
  const $el = e.target
  const targetTab = $el?.dataset?.tab
  const { origin, pathname } = window.location
  window.location.href = origin + pathname + `?type=${targetTab}`
}
