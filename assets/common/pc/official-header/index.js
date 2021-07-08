import { initTopbar as initRedTopbar } from '../official-red-topbar'
import { initTopbar as initWhiteTopbar } from '../official-white-topbar'
import { initSearch as initRedSearch } from '../official-red-search'
import '../official-nav-block'

if (!window.isCn) {
  if (window.isRedTopbar) {
    initRedTopbar()
    initRedSearch()
  } else {
    initWhiteTopbar()
  }
}