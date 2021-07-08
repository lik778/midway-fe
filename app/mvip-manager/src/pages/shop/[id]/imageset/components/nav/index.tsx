import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Input, Form } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import { TabScope, TabScopeItem } from "@/interfaces/shop";

import styles from "./index.less";

interface Props {
  shopId: number;
  tabScope: TabScope;
  isScopeAlbum: boolean;
  isScopeImage: boolean;
  curScope?: TabScopeItem;
  goTabScope: (scope: TabScopeItem) => void;
  createAlbum: () => void;
  openUpload: (defaultVal?: number) => void;
}
export default (props: Props) => {
  const { shopId, tabScope, curScope, isScopeAlbum, isScopeImage, goTabScope, createAlbum, openUpload } = props;

  const goHomeScope = () => goTabScope(tabScope[0])

  const handleCreateAlbum = () => createAlbum()

  const lastScopeName = curScope?.item?.name
  return (
    <>
      <div className={styles["nav-container"]}>
        {/* left actions */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={goHomeScope}>
            <a>相册管理</a>
          </Breadcrumb.Item>
          {isScopeImage && (
            <Breadcrumb.Item>{lastScopeName}</Breadcrumb.Item>
          )}
        </Breadcrumb>

        {/* right actions */}
        <div>
          {isScopeAlbum && (
            <Button
              className={styles["create-album-button"]}
              size="large"
              onClick={handleCreateAlbum}
            >
              新增相册
            </Button>
          )}
          <Button
            className={styles["upload-img-button"]}
            icon={<PlusOutlined />}
            size="large"
            type="primary"
            onClick={() => openUpload(curScope?.item?.id)}
          >
            上传图片
          </Button>
        </div>
      </div>
    </>
  );
};
