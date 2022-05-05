import $ from 'jquery'

export const jumpAndClick = () => {
    $(document).on('ready', function () {
        const serviceContent = $('.customer-service .service-content')
        serviceContent.on('click',()=>{
            console.log(serviceContent);
            serviceContent.toggleClass('service-click')
        })
        const entranceBtn = $('.customer-service .bax-btn')
        entranceBtn.on('click',()=>{
            const {position} = window.extraContactFormData
            window.location.href = `safeguard?position=${position}`
        })
    })
}    