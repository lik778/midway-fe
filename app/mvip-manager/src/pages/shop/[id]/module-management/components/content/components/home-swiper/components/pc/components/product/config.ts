// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';

// swiper 产品表单
export const swiperProductForm: FormConfig = {
  name: 'swiperProductForm',
  width: '100%',
  useLabelCol: { span: 6 },
  layout: 'vertical',
  children: [
    {
      label: '产品背景图', name: 'banner', maxLength: 1, type: FormType.ImgUpload, images: [{ uploadType: 1, text: '', name: 'banner', aspectRatio: 1920 / 540, maxSize: 3, cropProps: { aspectRatio: 1920 / 540, } }],
      required: true, tip: '注：最多上传1张背景图，图片格式为jpg/jpeg/png，不超过3M，建议尺寸为1920*540'
    }
  ],
}
