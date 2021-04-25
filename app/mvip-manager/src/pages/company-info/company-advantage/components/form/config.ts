//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const companyAdvantageFormConfigFn: (key: string | number) => FormConfig = (key) => ({
  name: `companyAdvantageForm${key}`,
  width: 690,
  useLabelCol: { span: 4 },
  children: [
    { label: '优势标题', name: 'title', type: FormType.Input, required: true, placeholder: '例如：品质优秀', formItemWidth: '100%', maxLength: 10, showCount: true },
    {
      label: '优势简介', name: 'desc', type: FormType.Textarea, required: true, placeholder: '请输入简介，30～50个字',
      minLength: 30, maxLength: 50, patternList: [{ pattern: /^[\s\S]{30,50}$/, message: '30～50个字' }]
    },
    {
      label: '上传图片', name: 'img', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道侧栏', name: 'bgImg', maxSize: 3 }],
      required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议最佳尺寸590*222', imagesTipPosition: 'right'
    },
  ]
}
)