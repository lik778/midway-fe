import $ from 'jquery'

//本页目的：只要页面归属某个导航栏，则该导航区块高亮
export const navModule = function() {
	$(document).ready(function() {
		//$(".nav-item > a").each((index, tab) => {
		//	const href = $(tab).attr('href')
		//	if (href.replace(/\/$/, '').endsWith(window.location.pathname.replace(/[n|p]\-?\d*.*\/?$|\/$/, function(result) {
		//		return result[0] === '/' ? '' : result[0]
		//	}))) {
		//$(tab).addClass('nav-active')
		//}
		//})

		const windowHref = window.location.href;
		const windowPath = window.location.pathname
		//定义一个方法：获取当前页面url中的第2个‘/’出现的位置
		function find(str,cha,num){
			var x=str.indexOf(cha);
			for(var i=0;i<num;i++){
				x=str.indexOf(cha,x+1);
			}
			return x;
			}
		const targetIndex = find(windowPath,'/',1)
		$(".nav-item >a").each((index, tab) => {
			const h = $(tab).attr('href');
			const n = h.slice(-2,-1); //提取导航里的尾部，展示n,p
			const t = windowPath.slice(targetIndex+1, targetIndex+2); //提取当前url的尾部，展示n,p
			console.log("t:",t);
			console.log("n:",n);
			console.log("h:",h);
			console.log("windowHref:",windowHref);
			console.log("windowPath:",windowPath);
			if(h==windowHref || t==n || h==windowPath){
				$(tab).addClass('nav-active')
				//siblings():所有同级a 元素去掉该class。
				//$(tab).parent().siblings().find('a').removeClass('nav-active')
			}
		})


	})
}
