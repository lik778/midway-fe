import { trackVisitor, loadTracker } from './tracker'
import $ from "jquery";
window.addEventListener('load', trackVisitor({}))

$(function () {
  loadTracker()
})