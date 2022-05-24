import $ from 'jquery';
import '../../../common/wap/official-header/index'
import { initNav } from '../../../common/nav'
import { initNavFn } from '../components/drawer-nav/index'
import { initOfficialFooterContact } from '../../../common/wap/official-footer-contact'
import { jumpAndClick } from '../../../common/wap/customer-service'

initNav($('.drawer-nav-box .nav-item'))
initNavFn()
initOfficialFooterContact()
jumpAndClick()
