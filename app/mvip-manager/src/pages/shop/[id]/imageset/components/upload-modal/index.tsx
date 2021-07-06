import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useUpload } from '../../hooks/upload'
import { useAlbumSelector } from '../album-selector'

import styles from './index.less';

const MAX_UPLOAD_COUNT = 30

export function useUploadModal() {

  /***************************************************** States */

  const [lists, setLists] = useState<any[]>([])
  const [visible, setVisible] = useState(false);
  const [$AlbumSelector, selectedAlbum] = useAlbumSelector()
  const [$Uploader, upload] = useUpload()

  /***************************************************** Interaction Fns */

  const openModal = () => setVisible(true)
  const closeModal = () => setVisible(false)

  const handleUpload = () => {

  }

  const uploadConfirm = () => {}

  /***************************************************** Renders */

  const showActions = lists.length > 0

  return [
    <Modal
      wrapClassName="upload-modal"
      title="上传图片"
      width={1000}
      footer={null}
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      {/* Selector */}
      <div>
        <span>上传到：</span>
        {$AlbumSelector}
      </div>

      {/* Container */}
      <div className={styles['upload-lists']}>
        {lists.map(item => {
          const { id, url } = item
          return (
            <div className={styles["upload-item"]} key={`upload-item-${id}-${url}`}>
              <img src={url} />
            </div>
          )
        })}
        {(lists.length < MAX_UPLOAD_COUNT) && (
          <div className={styles["upload-add"]} onClick={handleUpload}>
            <PlusOutlined />
          </div>
        )}
      </div>

      {/* Tips */}
      {!showActions && (
        <div className={styles['tips-con']}>
          <h4 className={styles["tip-header"]}>图片上传规范</h4>
          <div className={styles["tip"]}>1.图片不要包含<span className={styles["highlight"]}>水印、二维码、联系方式</span>等信息</div>
          <div className={styles["tip"]}>2.图片不要上传<span className={styles["highlight"]}>国家领导人的头像</span></div>
          <div className={styles["tip"]}>3.图片不能含有<span className={styles["highlight"]}>违法相关信息</span>（例如：黄、赌、毒等违法信息）</div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div>
          <Button
            className={styles["confirm-btn"]}
            type="primary"
            htmlType="submit"
            onClick={uploadConfirm}
          >
            确定
          </Button>
          <span className={styles["count-tip"]}>（共 {lists.length} 张图片）</span>
        </div>
      )}
    </Modal>,
    openModal
  ] as const
}
