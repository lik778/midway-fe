import $ from 'jquery';
export const leaveLeads = function() {
    $(document).ready(function() {
        console.log(11);
        $(".form-item > button").click((e) => {
            console.log(22);
            const data = {};
            data.name = $('#name').val();
            data.contact = $('#tel').val();
            data.content = $('#content').val();
            console.log('data:',data);
            $.ajax({
                url:"/api/midway/frontend/home/message",
                type:'POST',
                dataType: 'json',
                data: data,
                success:(res) =>{
                    alert(1)
                }
                //(result)=>{"将隐藏的元素显示3秒"}
            });
            e.preventDefault();

        })
    })
}