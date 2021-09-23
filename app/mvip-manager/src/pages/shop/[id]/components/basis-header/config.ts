// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// TDK表单
export const RecordForm: FormConfig = {
  name: 'tdkForm',
  children: [
    { label: '问题描述和建议', name: 'description', type: FormType.Textarea, required: true, minLength: 40, maxLength: 80, patternList: [{ pattern: /^[\s\S]{40,80}$/, message: '40～80个字' }], placeholder: '请输入描述，40～80个字' },
    { formItemWidth: 260, label: '联系电话', name: 'contactMobile', type: FormType.Input, required: true, minLength: 9, maxLength: 50, patternList: [{ pattern: /^[\s\S]{9,50}$/, message: '请输入电话' }], placeholder: '请输入标题，9~50个字', showCount: true },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}
