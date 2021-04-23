//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const companyAdvantageFormConfigFn: (key: string | number) => FormConfig = (key) => ({
  name: `companyAdvantageForm${key}`,
  width: 690,
  useLabelCol: { span: 4 },
  children: [
    { label: '详细地址', name: 'companyAddress', type: FormType.Input, required: true, placeholder: '详细地址（如街道、门牌号等）', formItemWidth: '100%' },
    {
      label: '企业简介', name: 'companyDescription', type: FormType.Textarea, required: true, placeholder: '请输入简介，50～300个字',
      minLength: 50, maxLength: 300, patternList: [{ pattern: /^[\s\S]{50,300}$/, message: '50～300个字' }]
    },
    {
      label: '侧边广告', name: 'banner2', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道侧栏', name: 'banner2', maxSize: 1 }],
      required: false, tip: '图片格式：jpg、jpeg、png，大小不超过1M，建议尺寸为365px*304px'
    },
  ]
}
)