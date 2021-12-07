//import { isEmptyObject } from '@/utils';
import React from 'react'
import { FormConfig, FormItem, CustomerFormItem } from '@/components/wildcat-form/interfaces';
import { FormType } from '@/components/wildcat-form/enums';
import { ModuleID } from '../../../data';
import styles from './index.less'
import pageStyles from '../../../index.less'

const moduleImage = {
  "1": "//file.baixing.net/202112/fbbe21318b09cc7c46a499e24984b62d.png",
  "2": "//file.baixing.net/202112/c5dccf6da0521a1ecd0070787b17c1df.png",
  "3": "//file.baixing.net/202112/e9ffc34fe43ae027a91d409c939aa3c7.png",
}

export const CustomBaseForm = (moduleID: ModuleID, formItems: FormItem[] = [], customerFormItems?: CustomerFormItem[]): FormConfig => {
  return {
    name: `customBaseForm${moduleID}`,
    width: '100%',
    useLabelCol: { span: 3 },
    children: [
      {
        className: pageStyles['form-item'], formItemWidth: 280, label: '是否在前端展现', name: 'show', type: FormType.Switch, required: true, patternList: [], slotDom: <><span className={styles['info-icon']}>查看示例</span>
          <img className={styles['info-img']} src={moduleImage[`${moduleID}`]} alt="" /></>
      },
      ...formItems
    ],
    customerFormItemList: customerFormItems
  }
}
