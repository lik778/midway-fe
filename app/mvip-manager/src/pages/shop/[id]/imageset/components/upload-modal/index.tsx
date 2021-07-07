import React, { useCallback, useState, useMemo } from 'react';
import { Button, Modal } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { errorMessage } from '@/components/message';
import { useUpload, UploadItem } from './upload'
import { useAlbumSelector } from '../album-selector'

import { AlbumItem } from '../../types'

import styles from './index.less';

const MAX_UPLOAD_COUNT = 30

// TODO 多选

type Props = {
  shopId: number;
  refresh: () => void;
  allAlbumLists: AlbumItem[]
}
export function useUploadModal(props: Props) {

  /***************************************************** States */
  const { shopId, refresh, allAlbumLists } = props
  const [visible, setVisible] = useState(true);
  const [$AlbumSelector, selectedAlbum] = useAlbumSelector({ allAlbumLists })
  const canUpload = true || useMemo(() => !!selectedAlbum, [selectedAlbum])
  const [$uploader, lists, add, remove] = useUpload()
  const canConfirm = useMemo(() => lists.every(x => x.state === 'done'), [lists])

  /***************************************************** Interaction Fns */

  const openModal = () => setVisible(true)
  const closeModal = () => setVisible(false)

  const uploadConfirm = () => {
    const isAllUploaded = false
    if (isAllUploaded) {
      closeModal()
    }
  }

  const handleRemove = useCallback((item: UploadItem) => {
    remove(item)
  }, [remove])

  /***************************************************** Renders */

  const showActions = lists.length > 0

  // ? PERF
  // 渲染上传列表
  const renderLists = useCallback(() => lists.map((item: UploadItem, idx) => {
    const { uid, state, percent, preview, error } = item
    let $contents
    let dispearMask = false
    console.log('state: ', state)
    if (state === 'uploading') {
      const radius = 25
      const percent100Len = Math.ceil(2 * 3.14 * radius)
      const exactPercent = percent ? Math.floor(percent) : 0
      $contents = <>
        <svg className={styles['progress']} width="60px" height="60px">
          <circle r="25" cy="30" cx="30" stroke-width="3" stroke="rgba(0,0,0,0.5)" stroke-linejoin="round" stroke-linecap="round" fill="none" />
          <circle r="25" cy="30" cx="30" stroke-width="3" stroke="#1790FF" stroke-linejoin="round" stroke-linecap="round" fill="none" stroke-dashoffset="0px" stroke-dasharray={percent100Len + 'px'} />
        </svg>
        <span className={styles["upload-info"]}>{exactPercent}%</span>
      </>
    }
    if (state === 'error') {
      $contents = <span className={styles["upload-info"]}>{error || '出错了'}</span>
    }
    if (state === 'chibi') {
      $contents = <span className={styles["upload-info"]}>审核中</span>
    }
    if (state === 'done') {
      dispearMask = true
      $contents = <>
        <div className={styles['upload-item-actions']}>
          <span className={styles['action']} onClick={() => handleRemove(item)}>
            <DeleteOutlined />
          </span>
        </div>
      </>
    }
    if (!state) {
      dispearMask = true
    }
    return (
      <div className={styles["upload-item"]} key={`${uid}-${idx}-${state}`}>
        <img className={styles["upload-img"]} src={preview} />
        <div className={styles["mask"] + (dispearMask ? styles['none'] : '')} />
        <div className={styles["wrapper"]}>{$contents}</div>
      </div>
    )
  }), [lists])

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
        {renderLists()}
        {(lists.length < MAX_UPLOAD_COUNT) && (
          <div className={styles["upload-add"] + (canUpload ? '' : ' disabled')}>
            <PlusOutlined />
            {$uploader}
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
            disabled={!canConfirm}
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
