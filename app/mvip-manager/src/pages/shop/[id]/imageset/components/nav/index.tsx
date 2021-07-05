import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Input, Form } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import { TabScope, TabScopeItem } from "../../types";

import styles from "./index.less";

interface Props {
  shopId: number;
  tabScope: TabScope;
  isScopeAlbum: boolean;
  isScopeImage: boolean;
  goTabScope: (scope: TabScopeItem) => void;
  createAlbum: () => void;
}
export default (props: Props) => {
  const { shopId, tabScope, isScopeAlbum, isScopeImage, goTabScope, createAlbum } = props;

  const uploadImage = () => {};

  return (
    <div>
      <div className={styles["nav-container"]}>
        {/* left actions */}

        {isScopeAlbum && <div />}
        {isScopeImage && (
          <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={() => goTabScope(tabScope[0])}>
              <a>相册管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>默认相册</Breadcrumb.Item>
          </Breadcrumb>
        )}

        {/* right actions */}
        <div>
          {isScopeAlbum && (
            <Button
              className={styles["create-album-button"]}
              size="large"
              onClick={createAlbum}
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
