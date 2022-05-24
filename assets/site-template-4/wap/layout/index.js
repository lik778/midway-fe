import $ from 'jquery'
import '../../../common/wap/official-header/index'
import { initNav } from '../../../common/dynamic-nav'
import { initOfficialFooterContact } from '../../../common/wap/official-footer-contact'
import { initNavToggle } from '../components/nav'
import { jumpAndClick } from '../../../common/wap/customer-service'

initOfficialFooterContact()
initNav($('.nav-container .nav-content .nav-item .nav-item-content'))
initNav($('.nav-container .nav-all .nav-item .nav-item-content'))
initNavToggle()
jumpAndClick()
