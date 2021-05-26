//import { isEmptyObject } from '@/utils';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';

export const shopInfoForm: FormConfig = {
  name: 'shopInfoForm',
  width: '100%',
  useLabelCol: { span: 3 },
  children: [
    { formItemWidth: 260, label: '店铺名称', name: 'name', type: FormType.Input, required: true, maxLength: 20, minLength: 1, patternList: [{ pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }],  placeholder: '请输入店铺名称，1~20个字', showCount: true },
    { formItemWidth: 260, label: '行业属性', name: 'shopType', type: FormType.Select, required: true, placeholder: '提交后不支持修改' },
    { formItemWidth: 260, label: '域名类型', name: 'domainType', type: FormType.Select, required: true, placeholder: '请选择域名类型' },
    // {
    //   label: '侧边广告', name: 'banner2', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道侧栏', name: 'banner2', maxSize: 3 }],
    //   required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议尺寸为365px*304px'
    // },
    // {
    //   className: 'zhidao-big-banner', label: '中部广告', name: 'banner1', maxLength: 1, type: FormType.ImgUpload, images: [{ text: '知道banner', name: 'banner1', maxSize: 3 }],
    //   required: false, tip: '图片格式：jpg、jpeg、png，大小不超过3M，建议尺寸为815px*108px'
    // }
  ]
}
