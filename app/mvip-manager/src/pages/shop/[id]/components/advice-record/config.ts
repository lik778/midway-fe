// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'
// 表单
const phoneFliterRules = /(^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$)|(^((86)|(\\+86))?1[3-9][0-9]{9}$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4})(.)(\d{1,4})$)|(^(400)-{0,1}(\d{3})-{0,1}(\d{4}$))/
export const RecordForm: FormConfig = {
  name: 'tdkForm',
  labelAlign:"left",
  children: [
    { label: '问题描述和建议', name: 'description', type: FormType.Textarea, required: true, minLength: 2, maxLength: 50, patternList: [{ pattern: /^[\s\S]{2,50}$/, message: '2～50个字' }], placeholder: '请输入描述，1～50个字',labelCol:{ style: {width: '100%'} } },
    { label: '联系电话', name: 'contactMobile', type: FormType.Input, required: false, patternList: [{ pattern: phoneFliterRules, message: '请输入正确的联系方式' }]},
  ],
  buttonConfig: { text: '提交', size: 'large', className: styles['record-btn'] }
}
