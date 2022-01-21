// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 文章表单
export const articleForm: FormConfig = {
  name: 'articleForm',
  width: 650,
  children: [
    { formItemWidth: 260, className: 'f-middle', label: '文章分组', name: 'contentCateId', type: FormType.Select, options: [], required: true, placeholder: '暂无分组', slotDom: { text: '新建分组' } },
    { formItemWidth: 395, className: 'f-middle', label: '文章标题', name: 'name', type: FormType.Input, required: true, maxLength: 50, placeholder: '请输入标题，2~50个字', minLength: 2, patternList: [{ pattern: /^[\s\S]{2,50}$/, message: '2～50个字' }], showCount: true },
    { formItemWidth: 130, label: '标签', name: 'tags', type: FormType.Tag, required: true, minLength: 1, maxLength: 10, placeholder: '输入标签', maxNum: 30, minNum: 1 },
    { label: '文章描述', name: 'content', type: FormType.RichText, required: true , placeholder: '请输入描述' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}
