import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
// 页面配置

export const MessageForm = (): FormConfig => ({
  name: 'messageForm',
  width: '100%',
  useLabelCol: {
    span: 2
  },
  children: [
    { formItemWidth: 260, label: '表单标题', name: 'title', type: FormType.Input, required: true, maxLength: 20, placeholder: '请输入标题，2~20个字', minLength: 0, patternList: [{ pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }], showCount: true },
    { formItemWidth: 395, label: '表单按钮', name: 'button', type: FormType.Input, required: false, maxLength: 10, placeholder: '请输入标题，2~10个字', minLength: 0, patternList: [{ pattern: /^[\s\S]{2,10}$/, message: '2～10个字' }], showCount: true },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
})