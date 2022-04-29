import './index.styl'

const entranceBtn = $('#entrance')
entranceBtn.on('click',()=>{
	const {position} = window.extraContactFormData
    window.location.href = `safeguard?position=${position}`
})