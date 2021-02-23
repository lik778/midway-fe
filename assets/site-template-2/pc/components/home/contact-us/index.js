import $ from 'jquery';
export const leaveLeads = function() {
    $(document).ready(function() {
        $(".form-item > button").click((e) => {
            const data = {};
            data.name = $('#name').val();
            data.contact = $('#tel').val();
            data.content = $('#content').val();
            data.shopName = $('#shop-name').text();
            console.log('data:',data);
            if(data.name === '') {
                alert('请留下您的姓名')
                return false
            }
            if(!/[0-9]{11}/.test(data.contact)) {
                alert('请填写正确的手机号码')
                return false
            }
            $.ajax({
                url:"/site-api/leads",
                type:'POST',
                dataType: 'json',
                data: data,
                success:(res) =>{
                    alert("提交成功")
                }
            });
            //这里很奇怪，会跳走。先阻止
            //e.preventDefault();
        })
    })
}