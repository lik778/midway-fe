import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Form, Input } from "antd";

import { successMessage, errorMessage } from "@/components/message";
import { createImagesetAlbum, updateImagesetAlbum } from "@/api/shop";

import { AlbumItem } from "@/interfaces/shop";

import styles from './index.less'

let createAlbumResover: ((isDone: boolean | PromiseLike<boolean>) => void) | null = null

type Props = {
  shopId: number;
  refresh: () => void;
}
export function useCreateAlbumModal(props: Props) {

  /***************************************************** States */

  const { shopId, refresh } = props

  const [form] = Form.useForm();
  const [defaultVals, setDefaultVals] = useState<any>({})
  const [isEditing, setIsEditing] = useState(false)
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 打开模态框
  const openModal = async (album?: AlbumItem): Promise<boolean> => {
    if (album) {
      const { id, name } = album
      setDefaultVals({ id, name })
      form.setFieldsValue(defaultVals)
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
    setVisible(true)
    return await new Promise(resolve => {
      createAlbumResover = resolve
    })
  }

  const closeModal = () => {
    createAlbumResover && createAlbumResover(false)
    setVisible(false)
  }

  /***************************************************** Actions */

  // 新增及编辑相册
  const createAlbum = useCallback(async () => {
    form.validateFields()
      .then(formvals => {
        setLoading(true);
        let post = null
        let successMsg = ''
        let params: any = {}
        if (isEditing) {
          params.id = defaultVals.id
          post = updateImagesetAlbum
          successMsg = "编辑成功"
        } else {
          post = createImagesetAlbum
          successMsg = "创建成功"
        }
        post(shopId, { ...formvals, ...params })
          .then(res => {
            if (res.success) {
              successMessage(successMsg);
              refresh();
              setVisible(false);
              form.resetFields();
              setDefaultVals({})
              createAlbumResover && createAlbumResover(true)
            } else {
              throw new Error(res.message || "出错啦，请稍后重试");
            }
          })
          .catch(error => {
            errorMessage(error.message);
            createAlbumResover && createAlbumResover(false)
          })
          .finally(() => {
            setLoading(false);
            createAlbumResover && createAlbumResover(false)
          });
      })
  }, [createAlbumResover])

  /***************************************************** Renders */

  return [
    <Modal
      wrapClassName="create-album-modal"
      title={isEditing ? '编辑相册' : "新建相册"}
      width={432}
      footer={null}
      visible={visible}
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
          label="相册名称"
          rules={[
            { pattern: /^[\s\S]{2,20}$/, message: "字数限制为 2～20 个字符" },
          ]}
        >
          <Input placeholder="请输入相册名称" />
        </Form.Item>
      </Form>
      <div className={styles["extra"]}>
        <div className={styles["name-tip"]}>
          注：可填写2~30个字符，支持中、英文，请不要填写特殊符号
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
