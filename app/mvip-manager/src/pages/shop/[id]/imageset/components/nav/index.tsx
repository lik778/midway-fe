import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Input, Form } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import { TabScope } from "../../index";

import styles from "./index.less";

interface Props {
  shopId: number;
  tabScope: TabScope;
  goAlbumPage: () => void;
  openCreateAlbumModal: () => void;
}
export default (props: Props) => {
  const { shopId, tabScope, goAlbumPage, openCreateAlbumModal } = props;

  const uploadImage = () => {};

  return (
    <div>
      <div className={styles["nav-container"]}>
        {/* left actions */}

        {tabScope === "album" && <div />}
        {tabScope === "image" && (
          <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={goAlbumPage}>
              <a>相册管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>默认相册</Breadcrumb.Item>
          </Breadcrumb>
        )}

        {/* right actions */}
        <div>
          {tabScope === "album" && (
            <Button
              className={styles["create-album-button"]}
              size="large"
              onClick={openCreateAlbumModal}
            >
              新增相册
            </Button>
          )}
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
