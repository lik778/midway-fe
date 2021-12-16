import React from 'react';
// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'
// 服务表单
export const navInfoForm = (): FormConfig => ({
  name: 'navInfoForm',
  width: '800px',
  useLabelCol: {
    span: 3
  },
  children: [
    { className: styles['nav-textarea-box'], label: '企业优势', name: 'slogan', type: FormType.Textarea, required: false, minLength: 6, maxLength: 20, placeholder: '请输入企业优势，6~20字\n示例：品牌数控设备一站式供应商', patternList: [{ pattern: /^[\s\S]{6,20}$/, message: '6～20个字' }] },
    {
      label: '微信二维码', name: 'qrImgGroup', type: FormType.ImgUpload, required: false, maxLength: 1, images: [{ uploadType: 2, text: '', name: 'qrImg', maxSize: 3, cropProps: { aspectRatio: 100 / 100 }, aspectRatio: 100 / 100 }], imagesTipPosition: 'right', tip: <div className={styles['tip']}> <img className={styles['qr']} src="//file.baixing.net/202112/2c7d59701beaa7952306bca832d6fa24.png" /> <div className={styles['demo']}>示例图</div>
        <div className={styles['text']}>
          <p className={`${styles['image-tip']}`}>图片格式：jpg、jpeg、png，大小不超过3M，建议尺寸100*100  </p>
          <p className={`${styles['image-tip']} ${styles['red-tip']}`}>严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担</p>
        </div>  </div>, imageTipHide: true
    },
  ]
})