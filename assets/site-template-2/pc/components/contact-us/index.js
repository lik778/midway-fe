import $ from 'jquery';
export const leaveLeads = function() {
    $(document).ready(function() {
        $(".form-item > button").click((e) => {
            e.preventDefault();
            const data = {};
            data.name = $('#name').val();
            data.contact = $('#tel').val();
            data.content = $('#content').val();
            data.shopName = $('#shop-name').text();
            if(data.name === '') {
                alert('请留下您的姓名')
                return false
            }
            if(data.contact == ''){
                alert('请留下您的联系方式')
                return false
            }
            //if(!/[0-9]{11}/.test(data.contact)) {
            //    alert('请填写正确的手机号码')
            //    return false
            //}
            $.ajax({
                url:"/site-api/leads",
                type:'POST',
                dataType: 'json',
                data: data,
                async:true,
                success:(res) =>{
                    alert("提交成功")
                },
                error:(res)=>{
                    alert(res)
                }
            });
        })
    })
}