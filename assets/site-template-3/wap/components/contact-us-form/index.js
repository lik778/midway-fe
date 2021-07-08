import $ from 'jquery';
import { eventTracker } from '../../../../common/tracker';

export const leaveLeads1 = function () {
    $(document).on('ready', function () {
        $("#upContactUsForm").on('click', (e) => {
            e.preventDefault();
            const data = {};
            data.name = $('#contactUsName').val();
            data.contact = $('#contactUsTel').val();
            data.content = '';
            data.shopName = $('#shop-name').text();
            if (data.name === '') {
                alert('请留下您的称呼')
                return false
            }
            if (data.name.length > 50) {
                alert('称呼最多50个字符')
                return false
            }
            if (data.contact == '') {
                alert('请留下您的联系方式')
                return false
            }
            if (data.contact.length > 50) {
                alert('联系方式最多50个字符')
                return false
            }
            //if(!/[0-9]{11}/.test(data.contact)) {
            //    alert('请填写正确的手机号码')
            //    return false
            //}
            $('#upContactUsForm').attr('disabled', 'true')
            // 添加leeds打点
            eventTracker('comment-wap', '', 'click',
                { mobile: data.contact })
            $.ajax({
                url: "/site-api/leads",
                type: 'POST',
                dataType: 'json',
                data: data,
                async: true,
                success: (res) => {
                    $('#upContactUsForm').attr('disabled', null)
                    if (res.success) {
                        alert("提交成功")
                    } else {
                        alert(res.message)
                    }
                },
                error: (res) => {
                    $('#upContactUsForm').attr('disabled', null)
                    alert(res.message)
                }
            });
        })
    })
}