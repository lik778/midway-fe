// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { ShopIndustryType } from '@/enums';

// 表单
export const aboutUsForm = (shopType: string): FormConfig => {
  const aspectRatio = 16 / 9
  return {
    name: 'aboutForm',
    width: '100%',
    useLabelCol: { span: 2 },
    children: [
      { formItemWidth: 260, label: '模块名称', name: 'name', type: FormType.Input, required: true, minLength: 2, maxLength: 6, patternList: [{ pattern: /^[\s\S]{2,6}$/, message: '2～6个字' }], placeholder: '请输入标题，2~6个字', showCount: true },
      { formItemWidth: 130, label: '公司标签', name: 'tags', type: FormType.Tag, required: true, maxLength: 4, placeholder: '输入标签', maxNum: 4, minNum: 2 },
      {
        formItemWidth: 150, label: '模块图片', name: 'media', type: FormType.ImgUpload, required: false, maxLength: 1, images: [{ uploadType: 2, text: '', name: 'media', maxSize: 3, cropProps: { aspectRatio }, aspectRatio }],
        tip: '图片格式：jpg、jpeg、png，大小不超过3M，图片比例16:9。'
      },
    ],
    buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
  }

}