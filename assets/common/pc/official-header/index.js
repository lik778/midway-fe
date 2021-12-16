import $ from 'jquery'
import { initTopbar } from '../official-topbar'
import { initInfo } from '../official-info'
import { initNav } from '../../nav'

export const initHeader = () => {
  initTopbar()
  initInfo()
  initNav($('.nav-item-box .nav-item'))
}
