import $ from 'jquery';
import './index.styl';
import '../layout/index';
import { viewTel } from '../components/product-detail/company-top';
import { mediaShow } from '../components/product-detail/media-show';
import { leaveLeads } from '../components/contact-us';
import { viewPhone } from '../components/contact-form-companyInfo';
import { initSem } from '../../../common/pc/contact-form-sem';

viewPhone();
leaveLeads();
viewTel();
mediaShow();

$(document).on('ready', function() {
  // sem部分链接需要禁止二跳
  if (isSem === '1') {
    initSem({
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $(
        '#layout-content .container a,.official-nav-block-bgc a',
      ),
    });
  }

  if (isSem === '2') {
    initSem({
      sem: isSem,
      type: 'detail',
      gotoOtherPageA: $('a'),
    });
  }
});
