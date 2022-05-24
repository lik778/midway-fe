import $ from 'jquery'
import { initTopbar } from '../../../../../../common/pc/official-topbar'
import { initInfo } from '../official-info'
// import { initNav } from '../../../../../../common/nav'
import { oficialNav } from '../official-nav'
export const initHeader = () => {
  initTopbar()
  initInfo()
  oficialNav()
  // initNav($('.nav-item-box .nav-item'))
}
