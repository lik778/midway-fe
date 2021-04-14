import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

const validatorArea =  (rule: any, val: any) => {
  if (!val || isEmptyObject(val)) {
    return Promise.reject('请输入企业地址')
  }
  return Promise.resolve()
}

export const baseInfoForm: FormConfig = {
  name: 'baseInfoForm',
  children: [
    { inputWidth: 260, className:'f-middle',label: '企业名称', name: 'companyName', type: FormType.Input, required: true, maxLength: 20, minLength: 2,placeholder: '请输入企业名称，2~20个字', disabled: false, showCount: true },
    { inputWidth: 260, className:'f-middle',label: '企业别称', name: 'companyAlias', type: FormType.Input, required: false, maxLength: 20, minLength: 2,placeholder: '请输入企业别称，2~20个字',showCount: true },
    { width: 353, className:'f-area-select',label: '企业地址', name: 'area', type: FormType.AreaSelect, required: true, patternList: [{ validator: validatorArea }] },
    { inputWidth: 260, className:'f-middle',label: '详细地址', name: 'companyAddress', type: FormType.Input, required: true, placeholder: '详细地址（如街道、门牌号等）' },
    { width: 690, label: '企业简介', className:'f-textarea', name: 'companyDescription', type: FormType.Textarea, required: true, placeholder: '请输入简介，50～300个字',
      minLength: 50, maxLength: 300, patternList: [ { pattern: /^[\s\S]{50,300}$/, message: '50～300个字'}  ] },
    { width: 690, label: '企业logo', name: 'promoteImg', maxLength: 1, type: FormType.ImgUpload, images: [{text:'企业logo', name: 'promoteImg', rule:[{required: true, message: `请上传企业logo` }]}],
      required: true, tip:'图片格式：jpg、jpeg、png，大小不超过1M，图片比例1：1，建议最小尺寸100*100' },
    { width: 353, className:'f-category-select',label: '类目', name: 'secondCategory', type: FormType.Select, required: true,  placeholder: '请选择类目' },
    { width: 690, className:'f-meta',label: '服务内容', name: 'thirdMetas', type: FormType.MetaChecbox, required: true , display:false},
    { inputWidth: 260, minNum:1, className:'f-middle',label: '公司人数', name: 'employeeCount', type: FormType.InputNumber, required: true, placeholder: '请输入公司人数' },
    { inputWidth: 260, minNum:1, className:'f-middle',label: '公司年限', name: 'companyYears', type: FormType.InputNumber, required: true, placeholder: '请输入公司已经营年限' },
  ]
}

// 联系面表单
export const contactForm: FormConfig = {
  name: 'contactForm',
  children: [
    { width: 346, label: '联系人', name: 'contactName', type: FormType.Input, required: true, placeholder: '请输入联系人' },
    { width: 346, label: '电话号码', name: 'contactMobile', type: FormType.Input, required: true, placeholder: '请输入电话号码',
      patternList: [ {pattern: /(^(0[0-9]{2,3}\-{0,1})?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-{0,1}))?(1[0-9]\d{9})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/,
        message: '请输入正确的联系方式'} ]
    },
    { width: 346, label: '微信号码', name: 'wechat', type: FormType.Input, required: false, placeholder: '请输入微信号码',
      minLength: 6, maxLength: 20, patternList: [ { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{6,20}$/, message: '微信号码(6-20个字符)'} ] },
  ]
}
