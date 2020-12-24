import $ from 'jquery'
import { eventTracker } from '../../../../../common/tracker';

export const contactUsModule = function(){
	$(document).ready(function(){
		$(".contact a").click(()=>{
			eventTracker('qq-pc','siderbar-pc')
		});
	})
}