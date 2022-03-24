import React from 'react';
// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'
// 服务表单
export const productForm = (type: string, isB2B: boolean, onChange?: (params: any) => void): FormConfig => {
    const onChangeValue = (params: any) => {
        const {newValue, form, name} = params
        console.log(form.getFieldsValue(true))
        onChange && onChange(form.getFieldsValue(true))
    }
  const config: FormConfig = {
    name: 'productForm',
    width: 650,
    useLabelCol: {
      span: 4
    },
    children: [
      { formItemWidth: 260, label: `${type}分组`, name: 'contentCateId', type: FormType.Select, options: [], required: true, placeholder: '暂无分组', slotDom: { text: '新建分组' } },
      { formItemWidth: 395, 
        label: `${type}名称`, 
        name: 'name', 
        type: FormType.Input, 
        required: true, 
        maxLength: 50, 
        placeholder: '请输入标题，2~50个字', 
        minLength: 2, 
        patternList: [{ pattern: /^[\s\S]{2,50}$/, 
        message: '2～50个字' }], 
        showCount: true
      },
      { formItemWidth: 260, label: '市场价格', name: 'price', type: FormType.Input, required: false, maxLength: 8, placeholder: '例如：面议', showCount: false },
      { formItemWidth: 130, label: '标签', name: 'tags', type: FormType.Tag, required: true, minLength: 1, maxLength: 10, placeholder: '输入标签', maxNum: 30, minNum: 1 },
      {
        formItemWidth: 150, label: '用于封面', name: 'media', type: FormType.ImgUpload, required: false, maxLength: 1, images: [{ uploadType: 2, showVideo: true, text: '上传图片/视频', name: 'media', maxSize: 3, cropProps: { aspectRatio: 300 / 200 }, aspectRatio: 300 / 200 }],
        tip: <>
          <p className={styles['media-tip']}>图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200</p>
          <p className={styles['media-tip']}>视频建议尺寸：16:9，大小100M以内，视频时长最短3S，最长60S</p>
        </>
      },
      {
        formItemWidth: 150, label: '用于封面轮播', name: 'contentImg', type: FormType.ImgUpload, required: false, maxLength: 5, images: [{ uploadType: 2, text: '上传图片', name: 'contentImg', maxSize: 3, cropProps: { aspectRatio: 300 / 200, autoAspectRatio: false }, aspectRatio: 300 / 200 }],
        tip: '图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200'
      },
      {
        label: `${type}描述`, 
        name: 'content', 
        type: FormType.RichText, 
        required: true, 
        placeholder: '请输入描述', 
        onChange: (newValue: string, form) => {
            onChangeValue({newValue, form, name: 'content'})
        }
      }
    ],
    buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
  }
  // TODO;
  if (isB2B) {
    config.children.splice(4, 0, { formItemWidth: 130, label: 'SEO关键词', name: 'seoKeyWord', type: FormType.Tag, required: true, minLength: 1, maxLength: 12, placeholder: '输入关键词', maxNum: 1, minNum: 1, extra: <p className={styles['key-tip']}>标签会用于SEO优化，请填写一个产品相关的核心词即可。</p> })
  }
  return config
} 