import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

import styles from "./index.less";

interface Props {
  shopId: number;
  // TODO type
  createAlbum: () => void;
  uploadImage: () => void;
}
export default (props: Props) => {
  const {
    shopId,
    createAlbum,
    uploadImage
  } = props;

  return (
    <div>
      <div className={`nav-container ${styles["nav-container"]}`}>
        <div style={{ float: "right" }}>
          <Button
            className={styles["create-album-button"]}
            size="large"
            onClick={createAlbum}
          >
            文章分组
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
}
