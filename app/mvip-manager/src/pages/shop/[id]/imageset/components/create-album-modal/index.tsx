import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Form, Input } from "antd";

import { successMessage, errorMessage } from "@/components/message";
import { createImagesetAlbum, updateImagesetAlbum } from "@/api/shop";

import { AlbumItem } from '../../types'

import styles from './index.less'

type Props = {
  shopId: number;
  refresh: () => void;
}
export function useCreateAlbumModal(props: Props) {

  /***************************************************** States */

  const { shopId, refresh } = props

  const [createAlbumForm] = Form.useForm();
  const [createAlbumFormDefaultVals, setCreateAlbumFormDefaultVals] = useState<any>({})
  const [isEditingAlbum, setIsEditingAlbum] = useState(false)
  const [createAlbumModal, setCreateAlbumModal] = useState(false);
  const [createAlbumLoading, setCreateAlbumLoading] = useState(false);

  // 切换新建和编辑状态
  useEffect(() => {
    const notNull = (x: any) => !!x
    setIsEditingAlbum(Object.values(createAlbumFormDefaultVals).filter(notNull).length > 0)
  }, [createAlbumFormDefaultVals])

  // 打开模态框
  const openCreateAlbumModal = (album?: AlbumItem) => {
    if (album) {
      const { id, name } = album
      setCreateAlbumFormDefaultVals({ id, name })
    }
    setCreateAlbumModal(true)
  }
  useEffect(() => {
    createAlbumForm.setFieldsValue(createAlbumFormDefaultVals)
  }, [createAlbumFormDefaultVals])

  /***************************************************** Actions */

  // 新增及编辑相册
  const createAlbum = async () => {
    createAlbumForm.validateFields([])
      .then(formvals => {
        setCreateAlbumLoading(true);
        let post = null
        let successMsg = ''
        let params: any = {}
        if (isEditingAlbum) {
          params.id = createAlbumFormDefaultVals.id
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
              setCreateAlbumModal(false);
              createAlbumForm.resetFields();
              setCreateAlbumFormDefaultVals({})
            } else {
              throw new Error(res.message || "出错啦，请稍后重试");
            }
          })
          .catch(error => {
            errorMessage(error.message);
          })
          .finally(() => {
            setCreateAlbumLoading(false);
          });
      })
  };

  /***************************************************** Renders */

  return [
    <Modal
      wrapClassName="create-album-modal"
      title={isEditingAlbum ? '编辑相册' : "新建相册"}
      width={432}
      footer={null}
      visible={createAlbumModal}
      onCancel={() => setCreateAlbumModal(false)}
    >
      <Form
        name="create-album-form"
        form={createAlbumForm}
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
          loading={createAlbumLoading}
          onClick={createAlbum}
        >
          确定
        </Button>
      </div>
    </Modal>,
    openCreateAlbumModal
  ] as const
}
