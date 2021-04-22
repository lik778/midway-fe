import { CompanyAdvantageListItem } from '@/interfaces/user'
import React, { FC, forwardRef, Ref, useState } from 'react'
import { companyAdvantageFormConfigFn } from './config'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import WildcatForm from '@/components/wildcat-form';

interface Props {
  item: CompanyAdvantageListItem
}
const Form = (props: Props, parentRef: Ref<any>) => {
  const { item } = props
  const [config, setConfig] = useState<FormConfig>(() => companyAdvantageFormConfigFn(item.key))

  return <>
    <WildcatForm
      ref={parentRef}
      editDataSource={item}
      config={config}
    />
  </>
}

export default forwardRef(Form)