//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

//const validatorArea =  (rule: any, val: any) => {
//  if (!val || isEmptyObject(val)) {
//    return Promise.reject('请输入企业地址')
//  }
//  return Promise.resolve()
//}

export const zhidaoInfoForm: FormConfig = {
  name: 'zhidaoInfoForm',
  children: [
    { width: 353, className: 'f-category-select', label: '官网', name: 'siteUrl', type: FormType.Select, required: true, placeholder: '请选择' },
    {
      width: 690, label: '侧边广告', name: 'banner1', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道侧栏', name: 'banner1' }],
      required: true, tip: '图片格式：jpg、jpeg、png，大小不超过1M，建议尺寸为365px*304px'
    },
    {
      width: 690, className: 'zhidao-big-banner', label: '中部广告', name: 'banner2', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道banner', name: 'banner2' }],
      required: true, tip: '图片格式：jpg、jpeg、png，大小不超过1M，建议尺寸为815px*108px'
    }
  ] 
}
