import $ from 'jquery'

const all = $(".tab-header .all")
const sample = $(".tab-header .sample")
const open = $(".s-open")
const off = $(".s-off")
export const tabModule = function(){
	$(document).ready(function(){
		open.click(function(){
			all.show();
			sample.hide();
			open.hide()
			off.show()
		})
		off.click(function(){
			sample.show();
			all.hide();
			open.show()
			off.hide()
		})
	})
}