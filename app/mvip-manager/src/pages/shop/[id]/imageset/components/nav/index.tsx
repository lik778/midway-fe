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

  const [lastScope, setLastScope] = useState<TabScopeItem>();
  useEffect(() => {
    setLastScope(tabScope[tabScope.length - 1])
  }, [tabScope])

  const goHomeScope = () => goTabScope(tabScope[0])

  const uploadImage = () => {};

  const lastScopeName = lastScope?.item?.name
  return (
    <>
      <div className={styles["nav-container"]}>
        {/* left actions */}

        {isScopeAlbum && <div />}
        {isScopeImage && (
          <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={goHomeScope}>
              <a>相册管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{lastScopeName}</Breadcrumb.Item>
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
    </>
  );
};
