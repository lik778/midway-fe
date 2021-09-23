import React, { FC, useState } from 'react'
import { Modal, Form } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { cloneDeepWith } from 'lodash';
import CheckoutGroup from '@/components/checkout-group'
import { RecordForm } from './config'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'
interface Iprop {
  isModalVisible: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  sumbit: (value: any) => void
}

const AdivceRecord: FC<Iprop> = ({ isModalVisible, handleOk, handleCancel, sumbit }) => {
  const [editData, setEditData] = useState<any>(null)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  // const [config, setConfig] = useState<FormConfig>(() => {
  const configs = cloneDeepWith(RecordForm)
  configs.customerFormItemList = [{
    index: 2,
    key: 'checkbox',
    node: <CheckoutGroup />
  },
  {
    index: 1,
    key: 'advice',
    node: <p className={styles['record-icon']}>请不要输入敏感信息，例如：账号密码</p>
  }
  ]

  //   return config
  // })
  const [config, setConfig] = useState<FormConfig>(configs)
  const creatTitle = () => {
    return (
      <p className={styles['diamond-title']}>您好！以下是您对&nbsp;<span className={styles['diamond-company']}>钻石店铺&nbsp;</span>的意见反馈</p >
    )
  }
  return (
    <>
      <Modal
        title={creatTitle()}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        centered
        footer={null}
        className={styles['modal']}
      >
        <div className={styles["diamond-form"]}>
          <Form.Item>
            <WildcatForm
              editDataSource={editData}
              config={config}
              submit={sumbit}
              loading={formLoading}
            />
          </Form.Item>
        </div>
      </Modal>
    </>
  )
}

export default AdivceRecord