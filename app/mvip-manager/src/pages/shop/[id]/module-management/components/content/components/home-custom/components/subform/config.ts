//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const CustomSetFormConfigFn:
  (key: string | number, imageChange: (...arg: any) => any) => FormConfig =
  (key, imageChange) => ({
    name: `CustomModuleSubForm${key}`,
    width: 690,
    useLabelCol: { span: 4 },
    children: [
      {
        label: '子模块标题',
        name: 'title',
        type: FormType.Input,
        required: true,
        placeholder: '例如：品质优秀',
        formItemWidth: '100%',
        minLength: 2,
        maxLength: 20,
        patternList: [{ pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }],
        showCount: true
      },
      {
        label: '子模块简介',
        name: 'content',
        type: FormType.Textarea,
        required: true,
        placeholder: '请输入简介，20～120个字',
        minLength: 20,
        maxLength: 120,
        patternList: [{ pattern: /^[\s\S]{20,120}$/, message: '20～120个字' }]
      },
      {
        label: '上传图片',
        name: 'urlImg',
        maxLength: 1,
        type: FormType.ImgUpload,
        images: [{
          uploadType: 2,
          text: '',
          name: 'urlImg',
          maxSize: 3,
          rule: [{ required: true, message: `请上传图片` }],
          cropProps: { aspectRatio: 595 / 222 },
          aspectRatio: 595 / 222
        }],
        required: true,
        tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议最佳尺寸595*222，上传图片后，请选择合适的字体颜色。',
        imagesTipPosition: 'right',
        onChange: imageChange
      },
    ]
  })
