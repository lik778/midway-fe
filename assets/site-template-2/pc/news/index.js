import './index.styl'
import '../layout';
import '../../../common/pc/pagination/index'
import { navModule } from '../components/header'
import { initializeSidebarProductSwiper } from '../components/sidebar';
import { cateListActive } from '../components/sidebar/cate-list'

navModule()
initializeSidebarProductSwiper()
cateListActive()