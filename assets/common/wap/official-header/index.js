import { initWhiteTopbar } from '../white-topbar/index'
import { initRedTopbar } from '../red-topbar/index'

console.log(111,window.isRedTopbar);
if(window.isRedTopbar){
  initRedTopbar()
} else {
  initWhiteTopbar()
}
