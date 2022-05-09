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
            const href = window.location.href
            const id = /(?<=-)\d{4}(?=.html)/.exec(drawer-nav-box)?/(?<=-)\d{4}(?=.html)/.exec(href)[0]:''
            if(id){
                window.location.href = `safeguard?position=${position}&id=${id}`
            }
            window.location.href = `safeguard?position=${position}`
        })
    })
}    