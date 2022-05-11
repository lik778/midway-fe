import { trackVisitor, loadTracker } from './tracker'
import $ from "jquery";
import { jumpAndClick } from '../common/wap/customer-service/index'

window.addEventListener('load', trackVisitor({}))

$(function () {
  loadTracker()
  jumpAndClick()
})