import $ from 'jquery'

export const jumpAndClick = () => {
    $(document).on('ready', function () {
        const serviceContent = $('#bax')
        serviceContent.on('click',function(e) {
            e.preventDefault()
            serviceContent.toggleClass('service-click')
        })
        const entranceBtn = $('#entrance')
        entranceBtn.on('click',()=>{
            const {position} = window.extraContactFormData
            const href = window.location.href
            const id = new RegExp("(?<=-)\\d.*(?=.html)").exec(href) ? new RegExp("(?<=-)\\d.*(?=.html)").exec(href)[0] : ''
            if(id){
                window.location.href = `safeguard?position=${position}&id=${+id}`
            }else{
                window.location.href = `safeguard?position=${position}`
            }
        })
    })
}    
