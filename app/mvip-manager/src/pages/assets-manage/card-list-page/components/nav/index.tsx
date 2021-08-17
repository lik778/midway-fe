import React, { useEffect, useState } from "react"
import { history } from 'umi'
import { Breadcrumb, Button, Radio } from "antd"
import { PlusOutlined } from "@ant-design/icons"

import { TabScope, TabScopeItem } from "@/interfaces/shop"

import styles from "./index.less"

interface Props {
  shopId: number
  tabScope: TabScope
  curScope?: TabScopeItem
  goTabScope: (scope: TabScopeItem) => void
  createAlbum: () => void
  openUpload: (defaultVal?: number) => void
}
export default (props: Props) => {
  const { curScope, tabScope, goTabScope, createAlbum, openUpload } = props;

  const isScopeAlbum = curScope && curScope.type === 'album'

  // 目前只处理了单层文件夹的结构
  const lastScopeName = curScope?.item?.name || ''

  // 前往图片管理页面
  const goImageList = () => {
    history.replace('/assets-manage/image-list')
    goTabScope(tabScope[0])
  }

  return (
    <>
      <div className={styles["nav-container"]}>
        {/* left actions */}
        {(
          <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={() => goImageList()}>
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
