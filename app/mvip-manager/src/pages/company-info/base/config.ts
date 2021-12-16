import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

const validatorArea = (rule: any, val: any) => {
  if (!val || isEmptyObject(val)) {
    return Promise.reject('请选择企业地址')
  }
  return Promise.resolve()
}

//基础资料里的信息，增加了onchange,可被base父页面修改
export const baseInfoForm: FormConfig = {
  name: 'baseInfoForm',
  labelAlign: 'right',
  width: 680,
  useLabelCol: { span: 3 },
  children: [
    { formItemWidth: 260, label: '企业名称', name: 'companyName', type: FormType.Input, required: true, maxLength: 50, minLength: 2, patternList: [{ pattern: /^[\s\S]{2,50}$/, message: '2～50个字' }], placeholder: '请输入企业名称，2~50个字', disabled: false, showCount: true },
    { formItemWidth: 260, label: '企业别称', name: 'companyAlias', type: FormType.Input, required: false, maxLength: 20, minLength: 2, patternList: [{ pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }], placeholder: '请输入企业别称，2~20个字', showCount: true },
    { formItemWidth: 260, label: '企业地址', name: 'area', type: FormType.AreaSelect, required: true, patternList: [{ validator: validatorArea }] },
    { formItemWidth: 260, label: '详细地址', name: 'companyAddress', type: FormType.Input, required: true, placeholder: '详细地址（如街道、门牌号等）' },
    { formItemWidth: 260, label: '服务区域', name: 'serviceArea', type: FormType.Input, required: true, placeholder: '请输入服务区域' },
    {
      label: '企业简介', name: 'companyDescription', type: FormType.Textarea, required: true, placeholder: '请输入简介，50～2000个字',
      minLength: 50, maxLength: 2000, patternList: [{ pattern: /^[\s\S]{50,2000}$/, message: '50～2000个字' }]
    },
    {
      label: '企业logo', name: 'promoteImg', maxLength: 1, type: FormType.ImgUpload, images: [{ uploadType: 2, text: '企业logo', name: 'promoteImg', rule: [{ required: true, message: `请上传企业logo` }], cropProps: { aspectRatio: 100 / 100, notSelectCrop: true, autoAspectRatio: true } }],
      required: true, tip: '图片格式：jpg、jpeg、png，大小不超过1M，图片比例1：1，建议最小尺寸100*100'
    },
    // { formItemWidth: 260, label: '类目', name: 'secondCategory', type: FormType.Select, required: true, placeholder: '请选择类目' },
    // { label: '服务内容', name: 'thirdMetas', type: FormType.MetaChecbox, required: true, display: false },
    { formItemWidth: 260, label: '类目', name: 'metas', type: FormType.MetaSelect, required: true },
    { formItemWidth: 260, minNum: 1, label: '公司人数', name: 'employeeCount', type: FormType.InputNumber, required: true, placeholder: '请输入公司人数' },
    { formItemWidth: 260, minNum: 1, label: '公司年限', name: 'companyYears', type: FormType.InputNumber, required: true, placeholder: '请输入公司已经营年限' },
  ]
}

// 联系面表单
const phoneFliterRules = /(^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$)|(^((86)|(\\+86))?1[3-9][0-9]{9}$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/
// const phoneFliterRules = /(^(0[0-9]{2,3}\-{0,1})?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-{0,1}))?(1[0-9]\d{9})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/;
export const contactForm: FormConfig = {
  name: 'contactForm',
  width: 565,
  useLabelCol: { span: 4 },
  labelAlign: 'right',
  children: [
    { label: '联系人', name: 'contactName', type: FormType.Input, required: true, placeholder: '请输入联系人' },
    {
      label: '电话号码', name: 'contactMobile', type: FormType.Input, required: true, placeholder: '请输入电话号码',
      patternList: [{
        pattern: phoneFliterRules,
        message: '请输填写正确的号码，否则将影响留咨推送'
      }]
    },
    {
      label: '电话号码2', name: 'contactMobile2', type: FormType.Input, required: false, placeholder: '请输入电话号码',
      patternList: [{ pattern: phoneFliterRules, message: '请输入正确的联系方式' }]
    },
    {
      label: '微信号码', name: 'wechat', type: FormType.Input, required: false, placeholder: '请输入微信号码',
      minLength: 6, maxLength: 20, patternList: [{ pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{6,20}$/, message: '微信号码(6-20个字符)' }]
    },
  ]
}
