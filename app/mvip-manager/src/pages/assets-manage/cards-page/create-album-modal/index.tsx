import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Button, Modal, Form, Input } from "antd"

import { successMessage, errorMessage } from "@/components/message"
import { createMediaCategory, updateMediaCategory } from "@/api/shop"

import CardsPageContext from '../../context/cards-page'

import { MediaCateItem } from "@/interfaces/shop"

import styles from './index.less'

let createAlbumResover: ((isDone: boolean | PromiseLike<boolean>) => void) | null = null

type Props = {
  refresh: () => void
}
export default function useCreateAlbumModal(props: Props) {

  /***************************************************** States */

  const { refresh } = props
  const { directoryType, directoryLabel } = useContext(CardsPageContext)

  const [form] = Form.useForm()
  const [defaultVals, setDefaultVals] = useState<any>({})
  const [isEditing, setIsEditing] = useState(false)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // 打开模态框
  const openModal = useCallback(async (album?: MediaCateItem): Promise<boolean> => {
    if (album) {
      const { id, name } = album
      const defaultVals = { id, name }
      setDefaultVals(defaultVals)
      form.setFieldsValue(defaultVals)
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
    setVisible(true)
    return await new Promise(resolve => {
      createAlbumResover = resolve
    })
  }, [defaultVals, form])

  const closeModal = () => {
    createAlbumResover && createAlbumResover(false)
    setVisible(false)
    form.resetFields()
  }

  /***************************************************** Actions */

  // 创建资源文件夹（参数带上ID则为编辑）
  const createAlbum = useCallback(async () => {
    form.validateFields()
      .then(formvals => {
        setLoading(true)
        let post = null
        let successMsg = ''
        let params: any = {
          source: directoryType
        }
        if (isEditing) {
          params.id = defaultVals.id
          post = updateMediaCategory
          successMsg = "编辑成功"
        } else {
          post = createMediaCategory
          successMsg = "创建成功"
        }
        post({ ...formvals, ...params })
          .then(res => {
            if (res.success) {
              successMessage(successMsg)
              refresh()
              setVisible(false)
              form.resetFields()
              setDefaultVals({})
              createAlbumResover && createAlbumResover(true)
            } else {
              throw new Error(res.message || "出错啦，请稍后重试")
            }
          })
          .catch(error => {
            errorMessage(error.message)
            createAlbumResover && createAlbumResover(false)
          })
          .finally(() => {
            setLoading(false)
            createAlbumResover && createAlbumResover(false)
          })
      })
  }, [createAlbumResover, directoryType])

  /***************************************************** Renders */

  return [
    <Modal
      wrapClassName="create-album-modal"
      title={isEditing ? `编辑${directoryLabel}` : `新建${directoryLabel}`}
      width={432}
      footer={null}
      visible={visible}
      destroyOnClose={true}
      onCancel={closeModal}
    >
      <Form
        name="create-album-form"
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Form.Item
          name="name"
          label={(directoryLabel + "名称").slice(-4)}
          rules={[
            { pattern: /^[\s\S]{2,20}$/, message: `${directoryLabel}名称限制为 2～20 个字符` },
            { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5|(|)|[|]|{|}]+$/, message: `${directoryLabel}名称不允许有特殊字符` }
          ]}
        >
          <Input placeholder={`请输入${directoryLabel}名称`} />
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
