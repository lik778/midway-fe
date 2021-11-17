// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 文章表单
export const contentGroupForm: FormConfig = {
  name: 'contentGroupForm',
  width: 520,
  useLabelCol: { span: 4 },
  children: [
    { formItemWidth: '100%', label: '分组名称', name: 'name', type: FormType.Input, required: true, placeholder: '请输入分组名称，2~8个字', minLength: 2, maxLength: 8, patternList: [{ pattern: /^[\s\S]{2,8}$/, message: '2～8个字' }], showCount: true },
    { formItemWidth: '100%', label: '分组权重', name: 'weight', type: FormType.InputNumber, required: true, minNum: 1, maxNum: 1000, placeholder: '请输入分组权重' },
    { formItemWidth: '100%', label: 'SEO标题', name: 'seoT', type: FormType.Input, required: false, placeholder: '请输入SEO标题，9~50个字', maxLength: 50, showCount: true, patternList: [{ pattern: /^[\s\S]{9,50}$/, message: '9～50个字' }], },
    { formItemWidth: '100%', label: 'SEO关键词', name: 'seoK', type: FormType.Input, required: false, placeholder: '请输入SEO关键词，0~100个字', minLength: 0, maxLength: 100, showCount: true },
    { formItemWidth: '100%', label: 'SEO描述', name: 'seoD', type: FormType.Input, required: false, placeholder: '请输入SEO描述，40~80个字', maxLength: 80, showCount: true, patternList: [{ pattern: /^[\s\S]{40,80}$/, message: '40～80个字' }], },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}
