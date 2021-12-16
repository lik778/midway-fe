

import React, { FC, useEffect, useState, forwardRef, Ref, useMemo } from 'react';
import { Spin, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import WildcatForm from '@/components/wildcat-form';
import { FormInstance } from 'antd'
import { navInfoForm } from './config'
import styles from './index.less'
import { ShopInfo, NavInfo } from '@/interfaces/shop'
import { getImgUploadValueModel } from '@/components/img-upload';
import { FormConfig } from '@/components/wildcat-form/interfaces'

interface Props {
  upDateLoading: boolean
  editData: ShopInfo | null
}

const NavInfoForm = (props: Props, parentRef: Ref<{ form: FormInstance | null }>) => {
  const { upDateLoading, editData } = props
  const [formConfig, setformConfig] = useState<FormConfig>(navInfoForm())
  const data = useMemo(() => {
    console.log({
      qrImg: getImgUploadValueModel('IMAGE', editData?.navInfo?.qrImg || ''),
      slogan: editData?.navInfo?.slogan || '',
    })
    return {
      qrImg: getImgUploadValueModel('IMAGE', editData?.navInfo?.qrImg || ''),
      slogan: editData?.navInfo?.slogan || '',
    }
  }, [editData])

  return <>
    <Spin spinning={upDateLoading}>
      <div className={styles['title']}>店招信息设置
        <Tooltip color='#fff' overlayStyle={{ maxWidth: 800 }} overlayInnerStyle={{ color: '#999', padding: '10px 20px' }} title={<img style={{ width: '700px' }} src="//file.baixing.net/202112/3bc4d81a9958c4460763462b5b1a7cf6.png" />} placement='right'>
          <QuestionCircleOutlined className={styles['icon']} />
        </Tooltip></div>
      <WildcatForm
        editDataSource={data}
        ref={parentRef}
        config={formConfig}
        loading={upDateLoading}
        className={styles["nav-info-form"]}
      />
    </Spin>
  </>
}

export default forwardRef(NavInfoForm)