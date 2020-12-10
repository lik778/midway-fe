import $ from 'jquery'

export const s_click = function(){
	console.log(11);
	$(document).ready(function(){
		console.log(22);
		$("select").onchange(function(){
			console.log(33);
			window.location = this.value
		})

	})

}

