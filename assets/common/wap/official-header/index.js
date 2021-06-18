import { initWhiteTopbar } from '../white-topbar/index'
import { initRedTopbar } from '../red-topbar/index'

if(window.isRedTopbar){
  initRedTopbar()
} else {
  initWhiteTopbar()
}
