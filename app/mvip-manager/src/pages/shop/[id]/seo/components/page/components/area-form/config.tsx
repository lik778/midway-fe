import React, { useState, useEffect, FC } from 'react';
// tips: 页面配置
import { FormType } from '@/components/wildcat-form/enums';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'

// TDK表单
export const tdkForm = (AddPublic: React.ReactNode): FormConfig => ({
  name: 'tdkForm',
  children: [
    {
      formItemWidth: 130, label: 'SEO地域', name: 'areas', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入SEO地域', maxNum: 50, minNum: 1, patternList: [{
        validator: async (rule: any, value: string[]) => {
          if (!value || value.length === 0) {
            return Promise.resolve()
          } else if (value.some(item => item && item.indexOf('全国') !== -1)) {
            return Promise.reject('地区名称中禁止出现全国字样')
          }
          return Promise.resolve()
        }
      }],
      extra: '建议优先写城市，省份不要超过5个，如果是单城市用户，则可填写城市的下一级，如闵行区。'
    },
    {
      formItemWidth: 130, label: 'SEO后缀', name: 'suffixs', type: FormType.Tag, required: true, maxLength: 10, placeholder: '输入SEO后缀', maxNum: 50, minNum: 1, extra: <>
        {AddPublic}
        <p>'示例：厂家、价格、货源等。'</p>
      </>
    },
  ],
  buttonConfig: { text: '保存', size: 'large', className: 'mvip-btn' }
})