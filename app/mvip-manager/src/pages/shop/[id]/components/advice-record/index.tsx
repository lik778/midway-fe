import React, { FC, useState, useEffect, useRef } from 'react'
import { Modal, Form } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { cloneDeepWith } from 'lodash';
import CheckoutGroup from '@/components/checkout-group'
import { RecordForm } from './config'
import { AdviceRecord } from '@/interfaces/shop';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import MyModal from '@/components/modal/index'
import { setAdviceRecordApi } from '@/api/shop';
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
interface Iprop {
  id: string,
  isModalVisible: boolean,
  onCancel: () => void,
}
export enum ModalType {
  info = "info"
}
const AdivceRecord: FC<Iprop> = ({ id, isModalVisible, onCancel }) => {
  const [editData, setEditData] = useState<any>(null)
  const [config, setConfig] = useState<FormConfig>(RecordForm)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const ref = useRef<any>()
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
    if (ref.current) {
      ref.current.form.resetFields()
    }
  }, [isModalVisible])

  const creatTitle = () => {
    return (
      <span className={styles['diamond-title']}>您好！以下是您对&nbsp;<span className={styles['diamond-company']}>钻石店铺&nbsp;</span>的意见反馈</span>
    )
  }

  const sumbit = async (values: AdviceRecord) => {
    setFormLoading(true)
    const res = await setAdviceRecordApi(Number(id), values)
    setFormLoading(false)
    if (res?.success) {
      successMessage('提交成功')
      onCancel()
    } else {
      errorMessage('提交失败')
    }
  }

  const createContent = () => {
    return (
      <div className={styles["diamond-form"]}>
        <Form.Item key="diamondform">
          <WildcatForm
            editDataSource={editData}
            config={config}
            submit={sumbit}
            loading={formLoading}
            ref={ref}
          />
        </Form.Item>
      </div>
    )
  }


  return (
    <>
      <MyModal
        title={creatTitle()}
        content={createContent()}
        visible={isModalVisible}
        onCancel={onCancel}
        footer={null}
        width={1000}
        type={ModalType.info}
        maskClosable={true}
      />
    </>
  )
}

export default AdivceRecord