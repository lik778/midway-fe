//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const zhidaoInfoForm: FormConfig = {
  name: 'zhidaoInfoForm',
  width: 980,
  useLabelCol: { span: 2 },
  children: [
    { formItemWidth: 260, label: '官网', name: 'siteUrl', type: FormType.Select, required: false, placeholder: '请选择' },
    {
      label: '侧边广告', name: 'banner2', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道侧栏', name: 'banner2', maxSize: 3, cropProps: { aspectRatio: 365 / 304 } }],
      required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议尺寸为365px*304px'
    },
    {
      className: 'zhidao-big-banner', label: '中部广告', name: 'banner1', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道banner', name: 'banner1', aspectRatio: 815 / 108, maxSize: 3, cropProps: { aspectRatio: 815 / 108 } }],
      required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议尺寸为815px*108px'
    }
  ]
}
