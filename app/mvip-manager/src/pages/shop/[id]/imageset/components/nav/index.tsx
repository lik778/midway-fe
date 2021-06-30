import React, { useEffect, useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import { successMessage, errorMessage } from "@/components/message";
import { createImagesetAlbum } from "@/api/shop";
// import { createAlbumValidator } from './config'

import styles from "./index.less";

const FormItem = Form.Item

interface Props {
  shopId: number;
  // TODO type
  refresh: () => void;
}
export default (props: Props) => {
  const { shopId, refresh } = props;
  const [form] = Form.useForm();
  const [createAlbumModal, setCreateAlbumModal] = useState(false);
  const [createAlbumLoading, setCreateAlbumLoading] = useState(false);

  // 新增相册
  const createAlbum = async () => {
    form.validateFields()
      .then(formvals => {
        setCreateAlbumModal(true);
        setCreateAlbumLoading(true);
        createImagesetAlbum(shopId, formvals)
          .then(res => {
            if (res.success) {
              successMessage("创建成功");
              refresh && refresh();
              form.resetFields();
              setCreateAlbumModal(false);
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

  const uploadImage = () => {};

  return (
    <div>
      <div className={styles["nav-container"]}>
        <div />
        <div>
          <Button
            className={styles["create-album-button"]}
            size="large"
            onClick={createAlbum}
          >
            新增相册
          </Button>
          <Button
            className={styles["upload-img-button"]}
            icon={<PlusOutlined />}
            size="large"
            type="primary"
            onClick={uploadImage}
          >
            上传图片
          </Button>
        </div>
      </div>
      <Modal
        wrapClassName="create-album-modal"
        title="新建相册"
        width={432}
        footer={null}
        visible={createAlbumModal}
        onCancel={() => setCreateAlbumModal(false)}
      >
        <Form
          name="create-album-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item name="name" label="相册名称">
            <Input />
          </Form.Item>
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <FormItem
            name="name"
            label="相册名称"
            rules={[
              { required: true, message: '请填写相册名称' },
              { pattern: /^[\s\S]{2,20}$/, message: "字数限制为 2～20 个字符" },
            ]}
          >
            <Input placeholder="请输入相册名称" />
          </FormItem>
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
      </Modal>
    </div>
  );
};
