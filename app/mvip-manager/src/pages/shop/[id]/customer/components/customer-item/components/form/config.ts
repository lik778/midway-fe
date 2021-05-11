//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const CustomerSetFormConfigFn: (key: string | number, imageChange: (...arg: any) => any) => FormConfig = (key, imageChange) => ({
  name: `CustomerSetForm${key}`,
  width: 690,
  useLabelCol: { span: 4 },
  children: [
    { label: '子模块标题', name: 'title', type: FormType.Input, required: true, placeholder: '例如：品质优秀', formItemWidth: '100%', minLength: 2, maxLength: 8, patternList: [{ pattern: /^[\s\S]{2,8}$/, message: '2～8个字' }], showCount: true },
    {
      label: '子模块简介', name: 'content', type: FormType.Textarea, required: true, placeholder: '请输入简介，30～50个字',
      minLength: 30, maxLength: 50, patternList: [{ pattern: /^[\s\S]{30,50}$/, message: '30～50个字' }]
    },
    {
      label: '上传图片', name: 'urlImg', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '', name: 'urlImg', maxSize: 3 }],
      required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议最佳尺寸595*222，上传图片后，请选择合适的字体颜色。', imagesTipPosition: 'right', onChange: imageChange
    },
  ]
}
)