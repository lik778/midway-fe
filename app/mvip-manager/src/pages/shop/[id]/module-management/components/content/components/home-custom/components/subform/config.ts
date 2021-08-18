//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const CustomSetFormConfigFn:
  (Args: { key: string | number, moduleID: string }) => FormConfig =
  ({ key, moduleID }) => {
    const titleMax = moduleID === "1" ? 20 : 16
    const contentMax = moduleID === "1" ? 120 : 50
    const aspectRatio = moduleID === "1" ? 595 / 222 : 400 / 300
    const imageTip = moduleID === "1" ? '图片格式：jpg、jpeg、png，大小不超过3M，建议最佳尺寸595*222。'
      : '图片格式：jpg、jpeg、png，大小不超过3M，建议最佳尺寸400*300。'
    return {
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
          maxLength: titleMax,
          patternList: [{ pattern: new RegExp(`^[\\s\\S]{2,${titleMax}}$`), message: `2～${titleMax}个字` }],
          showCount: true
        },
        {
          label: '子模块简介',
          name: 'content',
          type: FormType.Textarea,
          required: true,
          placeholder: `请输入简介，20～${contentMax}个字`,
          minLength: 20,
          maxLength: contentMax,
          patternList: [{ pattern: new RegExp(`^[\\s\\S]{20,${contentMax}}$`), message: `20～${contentMax}个字` }]
        },
        {
          label: '上传图片',
          name: 'urlImg',
          maxLength: 1,
          type: FormType.ImgUpload,
          images: [
            // 不同的自定义模块裁剪参数不一样
            {
              uploadType: 2,
              text: '',
              name: 'urlImg',
              maxSize: 3,
              rule: [{ required: true, message: `请上传图片` }],
              cropProps: { aspectRatio },
              aspectRatio
            }
          ],
          required: true,
          tip: imageTip,
          imagesTipPosition: 'right',
        },
      ]
    }
  }