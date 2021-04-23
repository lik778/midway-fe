import { CompanyAdvantageListItem } from '@/interfaces/user'
import React, { FC, forwardRef, Ref, useState } from 'react'
import { Form } from 'antd'
import { companyAdvantageFormConfigFn } from './config'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import WildcatForm from '@/components/wildcat-form';
import styles from './index.less'
const FormItem = Form.Item

interface Props {
  index: number,
  item: CompanyAdvantageListItem
}

const fontNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const CompanyAdvantageForm = (props: Props, parentRef: Ref<any>) => {
  const { item, index } = props
  const [config, setConfig] = useState<FormConfig>(() => companyAdvantageFormConfigFn(item.key))

  return <div className={styles['form-box']}>
    <FormItem label={`优势${fontNumber[index]}`} required={true}>
      <WildcatForm
        ref={parentRef}
        editDataSource={item}
        config={config}
      />
    </FormItem>
  </div>
}

export default forwardRef(CompanyAdvantageForm)