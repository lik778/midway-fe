import React, { FC, useState, useEffect, useRef } from 'react'
import { Modal, Form } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { cloneDeepWith } from 'lodash';
import CheckoutGroup from '@/components/checkout-group'
import { RecordForm } from './config'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import MyModal from '@/components/modal/index'
import styles from './index.less'
interface Iprop {
  isModalVisible: boolean,
  loading: boolean,
  onCancel: () => void,
  sumbit: (value: any) => void,
  onInit: (item: any) => void
}
export enum ModalType {
  info = "info"
}
const AdivceRecord: FC<Iprop> = ({ isModalVisible, onCancel, sumbit, loading, onInit }) => {
  const [editData, setEditData] = useState<any>(null)
  const [config, setConfig] = useState<FormConfig>(RecordForm)
  const ref = useRef()
  useEffect(() => {
    const addConfig = () => {
      const configs = cloneDeepWith(RecordForm)
      configs.customerFormItemList = [{
        index: 3,
        key: 'radiaoGrounp',
        node: <CheckoutGroup />
      },
      {
        index: 2,
        key: 'advice',
        node: <p className={styles['record-icon']} key="advice">请不要输入敏感信息，例如：账号密码</p>
      }
      ]
      return configs
    }
    setConfig(addConfig())
  }, [])

  useEffect(() => {
    const form: any = ref.current
    if (form) {
      form.form.resetFields()
    }
  }, [isModalVisible])

  const creatTitle = () => {
    return (
      <span className={styles['diamond-title']}>您好！以下是您对&nbsp;<span className={styles['diamond-company']}>钻石店铺&nbsp;</span>的意见反馈</span>
    )
  }
  const createContent = () => {
    return (
      <div className={styles["diamond-form"]}>
        <Form.Item key="diamondform">
          <WildcatForm
            editDataSource={editData}
            config={config}
            submit={sumbit}
            loading={loading}
            onInit={onInit}
            ref={ref}
          />
        </Form.Item>
      </div>
    )
  }
  const onOk = () => { }
  return (
    <>
      <MyModal
        title={creatTitle()}
        content={createContent()}
        visible={isModalVisible}
        onCancel={onCancel}
        footer={null}
        onOk={onOk}
        width={1000}
        type={ModalType.info}
        maskClosable={true}
      />
    </>
  )
}

export default AdivceRecord