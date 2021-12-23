import $ from 'jquery';
import { eventTracker } from '../../../../common/tracker';

export const leaveLeads = function() {
    $(document).on('ready',function() {
      $('#upContactForm').on('click', (e) => {
        e.preventDefault();
        const data = {};
        const content = []
        const flag = false
        data.shopName = $('#shop-name').text()
        if (window.extraContactFormData) {
          Object
              .entries(window.extraContactFormData)
              .map(([k, v]) => data[k] = v)
      }
        $(':input[name="contact"]').each((e,i) => {
          if($(i).val() === '') {
            alert($(i).data('value'))
            flag = false
          }
          if($(i).val().length  > 20) {
            alert(`${$(i).data('key')}字数最多20个字符`)
            flag = false
          }
          if($(i).data('key') === '姓名') {
            data.name = $(i).val()
          } else if($(i).data('key') === '联系方式') {
            data.contact = $(i).val()
          } else {
            const item = $(i).data('key')+ '：'+ $(i).val()
            content.push(item)
          }
        })
        if(flag) {
          return false
        }
        data.content = content.join(';') || ''
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
       })
      })
    })
}


