import React, { useEffect, useState } from "react";
import { Button, Input, Form } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import styles from "./index.less";


interface Props {
  shopId: number;
  openCreateAlbumModal: () => void;
}
export default (props: Props) => {
  const { shopId, openCreateAlbumModal } = props;

  const uploadImage = () => {};

  return (
    <div>
      <div className={styles["nav-container"]}>
        <div />
        <div>
          <Button
            className={styles["create-album-button"]}
            size="large"
            onClick={openCreateAlbumModal}
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
    </div>
  );
};
