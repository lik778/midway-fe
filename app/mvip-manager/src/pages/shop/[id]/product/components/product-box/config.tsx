import React from 'react';
// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'
// 服务表单
export const productForm: FormConfig = {
  name: 'productForm',
  width: 650,
  useLabelCol: {
    span: 4
  },
  children: [
    { formItemWidth: 260, label: '服务分组', name: 'contentCateId', type: FormType.GroupSelect, options: [], required: true, placeholder: '暂无分组', slotDom: { text: '新建分组' } },
    { formItemWidth: 395, label: '服务名称', name: 'name', type: FormType.Input, required: true, maxLength: 50, placeholder: '请输入标题，2~50个字', minLength: 2, patternList: [{ pattern: /^[\s\S]{2,50}$/, message: '2～50个字' }], showCount: true },
    { formItemWidth: 260, label: '市场价格', name: 'price', type: FormType.Input, required: false, maxLength: 8, placeholder: '例如：面议', showCount: false },
    { formItemWidth: 130, label: '标签', name: 'tags', type: FormType.Tag, required: true, minLength: 1, maxLength: 10, placeholder: '输入标签', maxNum: 30, minNum: 1 },
    {
      formItemWidth: 150, label: '用于封面', name: 'media', type: FormType.ImgUpload, required: false, maxLength: 1, images: [{ uploadType: 2, showVideo: true, text: '用于封面', name: 'media', maxSize: 3, cropProps: { aspectRatio: 300 / 200 }, aspectRatio: 300 / 200 }],
      tip: <>
        <p className={styles['media-tip']}>图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200</p>
        <p className={styles['media-tip']}>视频建议尺寸：16:9，大小100M以内，视频时长最短3S，最长60S</p>
      </>
    },
    {
      formItemWidth: 150, label: '用于正文', name: 'contentImg', type: FormType.ImgUpload, required: false, maxLength: 5, images: [{ uploadType: 2, text: '用于正文介绍', name: 'contentImg', maxSize: 3, cropProps: { aspectRatio: 300 / 200, autoAspectRatio: true }, aspectRatio: 300 / 200 }],
      tip: '图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200'
    },
    { className: 'f-textarea', label: '服务描述', name: 'content', type: FormType.Textarea, required: true, minLength: 100, maxLength: 3000, placeholder: '请输入简介，100～3000个字' },
  ],
  buttonConfig: { text: '提交', size: 'large', className: 'mvip-btn' }
}
