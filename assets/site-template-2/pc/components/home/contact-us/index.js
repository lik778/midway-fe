import $ from 'jquery';
export const leaveLeads = function() {
    $(document).ready(function() {
        $(".form-item > button").click((e) => {
            const data = {};
            data.name = $('#name').val();
            data.contact = $('#tel').val();
            data.content = $('#content').val();
            data.shopName = $('#shop-name').text();
            $.ajax({
                url:"/site-api/leads",
                type:'POST',
                dataType: 'json',
                data: data,
                success:(res) =>{
                    alert(1)
                }
                //(result)=>{"将隐藏的元素显示3秒"}
            });
            //e.preventDefault();
        })
    })
}