import $ from 'jquery'

export const s_click = function(){
	$(document).ready(function(){
		$("select").onchange(function(){
			window.location = this.value
		})

	})

}

