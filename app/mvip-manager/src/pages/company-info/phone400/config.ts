//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

// 联系面表单
const phoneFliterRules = /(^(0[0-9]{2,3}\-{0,1})?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-{0,1}))?(1[0-9]\d{9})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/;
export const zhidaoInfoForm: FormConfig = {
  name: 'zhidaoInfoForm',
  width: 680,
  useLabelCol: { span: 3 },
  children: [
    {
      formItemWidth: 260, label: '号码1', name: 'phone1', type: FormType.Input, required: true, placeholder: '请输入电话号码', patternList: [{
        pattern: phoneFliterRules,
        message: '请输入正确的联系方式'
      }]
    },
    {
      formItemWidth: 260, label: '号码2', name: 'phone2', type: FormType.Input, required: false, placeholder: '请输入电话号码', patternList: [{
        pattern: phoneFliterRules,
        message: '请输入正确的联系方式'
      }]
    },
    {
      formItemWidth: 260, label: '号码3', name: 'phone3', type: FormType.Input, required: false, placeholder: '请输入电话号码', patternList: [{
        pattern: phoneFliterRules,
        message: '请输入正确的联系方式'
      }]
    },
    {
      formItemWidth: 260, label: '号码4', name: 'phone4', type: FormType.Input, required: false, placeholder: '请输入电话号码', patternList: [{
        pattern: phoneFliterRules,
        message: '请输入正确的联系方式'
      }]
    },
    {
      formItemWidth: 260, label: '号码5', name: 'phone5', type: FormType.Input, required: false, placeholder: '请输入电话号码', patternList: [{
        pattern: phoneFliterRules,
        message: '请输入正确的联系方式'
      }]
    },
  ]
}
