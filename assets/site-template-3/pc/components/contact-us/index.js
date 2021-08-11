import $ from 'jquery';
import { eventTracker } from '../../../../common/tracker';

export const leaveLeads = function() {
    $(document).on('ready',function() {
        $(".form-item > button").on('click',(e) => {
            e.preventDefault();
            const data = {};
            data.name = $('#name').val();
            data.contact = $('#tel').val();
            data.content = $('#content').val();
            data.shopName = $('#shop-name').text();
            if (window.extraContactFormData) {
                Object
                    .entries(window.extraContactFormData)
                    .map(([k, v]) => data[k] = v)
            }
            if(data.name === '') {
                alert('请留下您的姓名')
                return false
            }
            if(data.name.length > 50){
                alert('姓名最多50个字符')
                return false
            }
            if(data.contact == ''){
                alert('请留下您的联系方式')
                return false
            }
            if(data.contact.length > 50 ){
                alert('联系方式最多50个字符')
                return false
            }
            if(data.content.length > 255 ){
                alert('内容最多255个字符')
                return false
            }
            // 添加leeds打点
            eventTracker('comment-pc', '', 'click',
              { mobile: data.contact })
            $.ajax({
                url:"/site-api/leads",
                type:'POST',
                dataType: 'json',
                data: data,
                async:true,
                success:(res) =>{
                    if (res.success){
                        alert("提交成功")
                    }else{
                        alert(res.message)
                    }
                },
                error:(res)=>{
                    alert(res.message)
                }
            });
        })
    })
}
