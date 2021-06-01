import './index.styl'
import '../layout';
import { navModule } from '../components/header'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { cateListActive } from '../components/sidebar/cate-list'

navModule()
initializeSidebarProductSwiper()
cateListActive()