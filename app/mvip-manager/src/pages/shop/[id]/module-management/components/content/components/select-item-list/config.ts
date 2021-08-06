// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 表单
export const selectItemFrom = (): FormConfig => {
  return {
    name: 'selectItemFrom',
    width: '100%',
    useLabelCol: { span: 2 },
    children: [
      { formItemWidth: 260, label: '模块名称', name: 'name', type: FormType.Input, required: true, minLength: 2, maxLength: 6, patternList: [{ pattern: /^[\s\S]{2,6}$/, message: '2～6个字' }], placeholder: '请输入标题，2~6个字', showCount: true },
    ],
    buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
  }
}
