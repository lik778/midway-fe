import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Button, Modal } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { createImagesetImage, delImagesetImage } from '@/api/shop'
import { useAlbumSelector } from '../album-selector'
import { useUpload, UploadItem } from './upload'

import { AlbumItem, TabScopeItem } from "@/interfaces/shop";

import styles from './index.less';

const MAX_UPLOAD_COUNT = 30

// 保存 UploadItem 和 上传结果的关系
type UploadResMap = {
  uid: string;
  imageID: number;
}

type Props = {
  shopId: number;
  curScope?: TabScopeItem;
  allAlbumLists: AlbumItem[]
  refresh: () => void;
}

export function useUploadModal(props: Props) {

  /***************************************************** States */
  const { shopId, curScope, allAlbumLists, refresh } = props
  const [visible, setVisible] = useState(false);
  const [$AlbumSelector, selectedAlbum, setAlbum, setAlbumByID] = useAlbumSelector({ allAlbumLists })
  const [uploadedLists, setUploadedLists] = useState<UploadResMap[]>([])
  const canUpload = useMemo(() => !!selectedAlbum, [selectedAlbum])

  const [$uploader, lists, setLists, update, remove] = useUpload({
    afterUploadHook
  })
  const canConfirm = useMemo(() => lists.every(x => x.status === 'done' && !x.inChibi), [lists])

  useEffect(() => {
    if (selectedAlbum) {
      setLists([])
    }
  }, [selectedAlbum])

  const open = (defaultVal?: number) => {
    setAlbumByID(defaultVal)
    openModal()
  }

  /***************************************************** API Calls */

  async function afterUploadHook(item: UploadItem) {
    return await new Promise(async resolve => {
      item.inChibi = true
      update(item)
      try {
        const query = { imgUrl: item.response.url, mediaCateId: selectedAlbum!.id }
        const res = await createImagesetImage(shopId, query)
        if (res.success && (typeof res.data.id === 'number')) {
          item.inChibi = false
          update(item)
          setUploadedLists([...uploadedLists, {
            uid: item.uid,
            imageID: res.data.id
          }])
          resolve(true)
        } else {
          throw new Error('上传失败');
        }
      } catch (error) {
        item.inChibi = false
        item.status = 'error'
        update(item)
      }
    })
  }

  const handleRemove = useCallback((item: UploadItem) => {
    if (!selectedAlbum) return
    const { uid } = item
    const findUploaded = uploadedLists.find(x => x.uid === uid)
    if (findUploaded) {
      // dont care is delete done or not ...
      const query = { ids: [findUploaded.imageID], mediaCateId: selectedAlbum.id }
      delImagesetImage(shopId, query)
        .then(res => {
          if (res.success) {
            const findIDX = uploadedLists.findIndex(x => x === findUploaded)
            setUploadedLists([
              ...uploadedLists.splice(findIDX, 1)
            ])
          }
        })
    }
    remove(item)
  }, [uploadedLists, remove, selectedAlbum])

  /***************************************************** Interaction Fns */

  const openModal = () => setVisible(true)
  const closeModal = () => {
    setLists([])
    setVisible(false)
  }

  const confirm = useCallback(() => {
    if (canConfirm) {
      lists.length > 0 && refresh()
      closeModal()
    } else {
      Modal.confirm({
        title: '确认关闭',
        content: '仍有图片仍未上传成功',
        width: 532,
        onCancel() { },
        onOk() {
          refresh()
          closeModal()
        }
      })
    }
  }, [lists])

  /***************************************************** Renders */

  const showActions = lists.length > 0

  // 渲染上传列表
  // TODO 样式问题
  const renderLists = useCallback(() => lists.map((item: UploadItem, idx) => {
    const { uid, status, percent, preview, error, inChibi } = item
    let $contents
    let dispearMask = false
    if (inChibi === true) {
      $contents = <span className={styles["upload-info"]}>审核中</span>
    } else {
      if (status === 'uploading') {
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
      if (status === 'error') {
        $contents = <span className={styles["upload-info"] + ' ' + styles['error']} onClick={() => handleRemove(item)}>
          {(error || '出错了') + '，点击删除'}
        </span>
      }
      if (status === 'done') {
        dispearMask = true
        $contents = <>
          <div className={styles['upload-item-actions']}>
            <span className={styles['action']} onClick={() => handleRemove(item)}>
              <DeleteOutlined />
            </span>
          </div>
        </>
      }
      if (!status) {
        dispearMask = true
      }
    }
    return (
      <div className={styles["upload-item"]} key={`${uid}-${idx}-${status}`}>
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
      width={1045}
      closeIcon={null}
      footer={null}
      destroyOnClose={true}
      visible={visible}
      onCancel={confirm}
    >
      {/* Selector */}
      <div>
        <span>上传到：</span>
        {$AlbumSelector}
      </div>

      {/* Container */}
      <div className={styles['upload-lists']}>
        {renderLists()}
        {(lists.length < MAX_UPLOAD_COUNT) && canUpload && (
          <div className={styles["upload-add"]}>
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
            onClick={confirm}
          >
            确定
          </Button>
          <span className={styles["count-tip"]}>（共 {lists.length} 张图片）</span>
        </div>
      )}
    </Modal>,
    open
  ] as const
}
