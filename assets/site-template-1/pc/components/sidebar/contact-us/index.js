import $ from 'jquery'
import { eventTracker } from '../../../../../common/tracker';

export const contactUsModule = function(){
	$(document).on('ready',function(){
		$(".contact a").on('click',()=>{
			eventTracker('qq-pc','siderbar-pc')
		});
	})
}