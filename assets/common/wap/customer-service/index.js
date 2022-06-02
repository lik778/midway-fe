import $ from 'jquery';

export const jumpAndClick = () => {
	$(document).on('ready', function () {
		const serviceContent = $('.customer-service .service-content');
		serviceContent.on('click', () => {
			console.log(serviceContent);
			serviceContent.toggleClass('service-click');
		});
		const entranceBtn = $('.customer-service .bax-btn');
		entranceBtn.on('click', () => {
			const {position} = window.extraContactFormData;
			const href = window.location.href;
			let id = "";
			if (href.includes(".html")) {
				id = href.split("/").pop().replace(/[^0-9]/ig, "")
			}
			if (id) {
				window.location.href = `safeguard?position=${position}&id=${+id}`;
			} else {
				window.location.href = `safeguard?position=${position}`;
			}
		});
	});
};
