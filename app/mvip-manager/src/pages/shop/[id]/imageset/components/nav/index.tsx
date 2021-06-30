import React, { useEffect, useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

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
  const [createAlbumModal, setCreateAlbumModal] = useState(true);
  // const [createAlbumModal, setCreateAlbumModal] = useState(false);
  const [createAlbumLoading, setCreateAlbumLoading] = useState(false);

  const createAlbum = () => {
    setCreateAlbumModal(true);
    setCreateAlbumLoading(true);
    setTimeout(() => {
      setCreateAlbumModal(false);
      setCreateAlbumLoading(false);
    }, 2000);
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
        </Form>
        <div className={styles["extra"]}>
          <div className={styles["name-tip"]}>
            注：可填写2~30个字符，支持中、英文，请不要填写特殊符号
          </div>
          <Button
            className={styles["confirm-btn"]}
            type="primary"
            onClick={uploadImage}
          >
            确定
          </Button>
        </div>
      </Modal>
    </div>
  );
};
