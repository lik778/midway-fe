import $ from 'jquery';
import { eventTracker } from './tracker';

export const leaveLeads = () => {
  $(function() {
    $('#SubmitButton').on('click', (e) => {
      e.preventDefault();
      const labeIcon = $('#labeIcon')
      const data = {};
      const content = []
      let flag = false
      const phoneFliterRules = /(^(0[0-9]{2,3}\-{0,1})?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-{0,1}))?(1[0-9]\d{9})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/
      data.shopName = $('#shop-name').text()
      if (window.extraContactFormData) {
        Object
            .entries(window.extraContactFormData)
            .map(([k, v]) => data[k] = v)
    }
      $(':input[name="contact"]').each((e,i) => {
        if($(i).val() === '' && Boolean($(i).data('fixed'))) {
          alert($(i).data('value'))
          flag = true
        }
        if($(i).val().length  > 20) {
          alert(`${$(i).data('key')}字数最多20个字符`)
          flag = true
        }
        if($(i).data('key') === '联系方式' && !phoneFliterRules.test($(i).val()) && $(i).val() !== '') {
          alert('请输入正确的联系方式')
          flag = true
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