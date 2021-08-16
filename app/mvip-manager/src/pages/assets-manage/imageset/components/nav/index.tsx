import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Radio } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { TabScope, TabScopeItem } from "@/interfaces/shop";

import styles from "./index.less";

interface Props {
  shopId: number;
  tabScope: TabScope;
  curScope?: TabScopeItem;
  goAlbumScope: () => void;
  goAuditScope: () => void;
  goTabScope: (scope: TabScopeItem) => void;
  createAlbum: () => void;
  openUpload: (defaultVal?: number) => void;
}
export default (props: Props) => {
  const { shopId, tabScope, curScope, goAlbumScope, goAuditScope, goTabScope, createAlbum, openUpload } = props;

  const isScopeAlbum = curScope && curScope.type === 'album'
  const isScopeImage = curScope && curScope.type === 'image'
  const isScopeAudit = curScope && curScope.type === 'audit'

  const curScopeType = curScope ? curScope.type : ''
  const lastScopeName = curScope?.item?.name || ''

  const handleNav = (e: any) => {
    const value = e.target.value
    if (value === 'album') {
      if (!isScopeAlbum) goAlbumScope()
    }
    if (value === 'audit') {
      if (!isScopeAudit) goAuditScope()
    }
  }

  const showRadioNav = isScopeAlbum || isScopeAudit
  const showBreadNav = !showRadioNav

  return (
    <>
      <div className={styles["nav-container"]}>
        {/* left actions */}
        {showRadioNav && (
          <Radio.Group value={curScopeType} onChange={handleNav}>
            <Radio.Button value="album">相册管理</Radio.Button>
            <Radio.Button value="audit">申诉记录</Radio.Button>
          </Radio.Group>
        )}
        {showBreadNav && (
          <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={goAlbumScope}>
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
              onClick={() => createAlbum()}
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
