// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// 表单
export const aboutUsForm: FormConfig = {
  name: 'aboutForm',
  width: '100%',
  useLabelCol: { span: 2 },
  children: [
    {
      formItemWidth: 150, label: '模块图片', name: 'backImg', type: FormType.ImgUpload, required: false, maxLength: 1, images: [{ uploadType: 2, text: '', name: 'backImg', maxSize: 3, cropProps: { aspectRatio: 1220 / 180 }, aspectRatio: 1220 / 180 }],
      tip: '图片格式：jpg、jpeg、png，大小不超过3M，尺寸需大于1220*180'
    },
  ],
  buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
}
