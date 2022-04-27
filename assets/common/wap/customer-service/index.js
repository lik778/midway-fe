import './index.styl'

const bax = $('#bax')
bax.on('click',()=>{
	const {position} = window.extraContactFormData
    window.location.href = `safeguard?position=${position}`
})