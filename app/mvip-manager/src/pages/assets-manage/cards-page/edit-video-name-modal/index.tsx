import React, { useState, useCallback, useContext } from 'react'
import { Button, Modal, Form, Input } from "antd"

import { successMessage, errorMessage } from "@/components/message"
import { updateMediaAssets } from "@/api/shop"

import CardsPageContext from '../../context/cards-page'

import { MediaAssetsItem } from "@/interfaces/shop"

import styles from './index.less'

let resolver: ((isDone: boolean | PromiseLike<boolean>) => void) | null = null

type Props = {
  refresh: () => void
}
export default function useEditVideoNameModal(props: Props) {

  /***************************************************** States */

  const { refresh } = props
  const { directoryType } = useContext(CardsPageContext)

  const [form] = Form.useForm()
  const [defaultVals, setDefaultVals] = useState<any>({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // 打开模态框
  const openModal = useCallback(async (item?: MediaAssetsItem): Promise<boolean> => {
    if (item) {
      const { id, title } = item
      const defaultVals = { id, title }
      setDefaultVals(defaultVals)
      form.setFieldsValue(defaultVals)
    }
    setVisible(true)
    return await new Promise(resolve => {
      resolver = resolve
    })
  }, [defaultVals, form])

  const closeModal = () => {
    resolver && resolver(false)
    setVisible(false)
    form.resetFields()
  }

  /***************************************************** Actions */

  // 编辑视频名称
  const createAlbum = useCallback(async () => {
    form.validateFields()
      .then(formvals => {
        setLoading(true)
        let post = null
        let successMsg = ''
        let params: any = {
          source: directoryType
        }
        params.id = defaultVals.id
        post = updateMediaAssets
        successMsg = "编辑成功"
        post({ ...formvals, ...params })
          .then(res => {
            if (res.success) {
              successMessage(successMsg)
              refresh()
              setVisible(false)
              form.resetFields()
              setDefaultVals({})
              resolver && resolver(true)
            } else {
              throw new Error(res.message || "出错啦，请稍后重试")
            }
          })
          .catch(error => {
            errorMessage(error.message)
            resolver && resolver(false)
          })
          .finally(() => {
            setLoading(false)
            resolver && resolver(false)
          })
      })
  }, [resolver])

  /***************************************************** Renders */

  return [
    <Modal
      wrapClassName="create-item-modal"
      title={'编辑视频'}
      width={432}
      footer={null}
      visible={visible}
      destroyOnClose={true}
      onCancel={closeModal}
    >
      <Form
        name="create-item-form"
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Form.Item
          name="title"
          label="视频名称"
          rules={[
            { pattern: /^[\s\S]{2,20}$/, message: "视频名称限制为 2～20 个字符" },
            { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5|(|)|[|]|{|}]+$/, message: '视频名称不允许有特殊字符' }
          ]}
        >
          <Input placeholder="请输入视频名称" />
        </Form.Item>
      </Form>
      <div className={styles["extra"]}>
        <div className={styles["name-tip"]}>
          注：可填写2~20个字符，支持中、英文，请不要填写特殊符号
        </div>
        <Button
          className={styles["confirm-btn"]}
          type="primary"
          htmlType="submit"
          loading={loading}
          onClick={createAlbum}
        >
          确定
        </Button>
      </div>
    </Modal>,
    openModal
  ] as const
}
