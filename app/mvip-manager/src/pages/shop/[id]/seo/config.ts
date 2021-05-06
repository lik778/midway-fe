// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// TDK表单
export const tdkForm: FormConfig = {
  name: 'tdkForm',
  children: [
    { formItemWidth: 260, label: 'SEO标题', name: 'title', type: FormType.Input, required: true, minLength: 9, maxLength: 50, patternList: [{ pattern: /^[\s\S]{9,50}$/, message: '9～50个字' }], placeholder: '请输入标题，9~50个字', showCount: true },
    { className: 'f-textarea', label: 'SEO描述', name: 'description', type: FormType.Textarea, required: true, minLength: 40, maxLength: 80, placeholder: '请输入描述，40～80个字' },
    { formItemWidth: 130, className: 'f-tag', label: 'SEO关键词', name: 'keywords', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入标签', maxNum: 20, minNum: 3 },
  ],
  buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
}
