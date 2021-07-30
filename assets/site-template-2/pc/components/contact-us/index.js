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
            const phoneFliterRules = /(^(0[0-9]{2,3}\-{0,1})?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-{0,1}))?(1[0-9]\d{9})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/;
            if(!phoneFliterRules.test(data.contact)){
                alert('请输入正确的联系方式')
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
