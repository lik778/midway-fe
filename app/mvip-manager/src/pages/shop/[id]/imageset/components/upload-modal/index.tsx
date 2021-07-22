import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { Button, Modal } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { reAuditImagesetImage, createImagesetImage, delImagesetImage } from '@/api/shop'
import { successMessage, errorMessage } from "@/components/message"
import { useAlbumSelector } from '../album-selector'
import { useUpload, UploadItem } from './upload'

import { ImageItem,  AlbumNameListItem, TabScopeItem } from "@/interfaces/shop";

import styles from './index.less';

const MAX_UPLOAD_COUNT = 15
const UPLOAD_RES_MAP_DEFAULT_ID = -1
const getID = (): string => String(Math.random()).slice(-6) + +new Date()

// 保存 UploadItem 和 上传结果的关系
type UploadResMap = {
  uid: string;
  imageID: number;
  inChibi: boolean;
  chibiFailed: boolean;
  status: string;
  error: string;
}

type Props = {
  shopId: number;
  curScope?: TabScopeItem;
  allAlbumLists: AlbumNameListItem[]
  refresh: () => void;
  createAlbum: () => void;
}

export function useUploadModal(props: Props) {

  /***************************************************** States */
  const { shopId, curScope, allAlbumLists, refresh, createAlbum } = props
  const [visible, setVisible] = useState(false);
  const [$AlbumSelector, selectedAlbum, setAlbum, setAlbumByID] = useAlbumSelector({ allAlbumLists })

  const handleCreateAlbum = () => createAlbum()

  // 10/10 垃圾，
  // 我需要这个数组用来记录已经上传的列表，
  // reRender 用来触发重渲染
  const uploadedLists = useRef<UploadResMap[]>([])
  const [reRender, setRerender] = useState(getID())
  const record = (newLists: UploadResMap[]) => {
    uploadedLists.current = newLists
    setRerender(getID())
    // 一秒之后触发重渲染，防止一直 pending 在“加载中”
    // @ts-ignore
    if (window._upload_rerender_tick) {
      // @ts-ignore
      clearInterval(window._upload_rerender_tick)
    }
    // @ts-ignore
    window._upload_rerender_tick = setInterval(() => {
      getID()
    }, 1000)
  }

  const canUpload = useMemo(() => !!selectedAlbum, [selectedAlbum])
  const [$uploader, lists, setLists, update, remove] = useUpload({
    maxCount: 15,
    afterUploadHook,
  })

  const canConfirm = useMemo(() => lists.every(x => x.status === 'done'), [lists])

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

  async function afterUploadHook(item: UploadItem, update: Function): Promise<UploadItem> {
    return await new Promise(async resolve => {
      record([...uploadedLists.current, {
        uid: item.uid,
        imageID: UPLOAD_RES_MAP_DEFAULT_ID,
        inChibi: true,
        chibiFailed: false,
        status: 'done',
        error: ''
      }])
      try {
        const query = { imgUrl: item.response.url, mediaCateId: selectedAlbum!.id }
        const res: any = await Promise.race([
          createImagesetImage(shopId, query),
          new Promise((resove, reject) => {
            setTimeout(() => {
              reject(new Error('上传超时，点击删除'))
            }, 15 * 1000)
          })
        ])
        if (res.success && (typeof res.data.id === 'number')) {
          const target = uploadedLists.current.find(x => x.uid === item.uid)
          if (target) {
            target.imageID = res.data.id
            target.inChibi = false
            target.chibiFailed = res.data.checkStatus !== 'APPROVE'
            record(uploadedLists.current)
          }
          resolve(item)
        } else {
          throw new Error(res.message || '上传失败')
        }
      } catch (error: any) {
        const target = uploadedLists.current.find(x => x.uid === item.uid)
        if (target) {
          target.inChibi = false
          target.status = 'error'
          target.error = error.message
          record(uploadedLists.current)
        }
      }
    })
  }

  const handleRemove = useCallback((item: UploadItem) => {
    if (!selectedAlbum) return
    const { uid } = item
    const findUploaded = uploadedLists.current.find(x => x.uid === uid)
    if (findUploaded && findUploaded.imageID !== UPLOAD_RES_MAP_DEFAULT_ID) {
      // dont care is delete done or not ...
      const query = { ids: [findUploaded.imageID], mediaCateId: selectedAlbum.id }
      delImagesetImage(shopId, query)
        .then(res => {
          if (res.success) {
            const findIDX = uploadedLists.current.findIndex(x => x === findUploaded)
            uploadedLists.current = uploadedLists.current.splice(findIDX, 1)
          }
        })
    }
    remove(item)
  }, [remove, selectedAlbum])

  // 申诉图片
  const reAuditImage = async (image: UploadResMap | undefined) => {
    if (image) {
      reAuditImagesetImage(shopId, { id: image.imageID })
        .then((res: any) => {
          if (res.success) {
            successMessage('申诉成功，请到图片管理 - 申诉记录查看进度')
          } else {
            throw new Error(res.message || '出错啦，请稍后重试')
          }
        })
        .catch((error: any) => {
          errorMessage(error.message)
        })
    }
  }

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
  // TODO REFACTOR 样式
  const renderLists = useCallback(() => lists.map((item: UploadItem, idx) => {
    const { uid, percent, preview } = item
    const uploadedItem = uploadedLists.current.find(x => x.uid === item.uid)
    const status = (uploadedItem ? uploadedItem.status : item.status) || 'error'
    const inChibi = uploadedItem ? uploadedItem.inChibi : false
    const chibiFailed = uploadedItem ? uploadedItem.chibiFailed : false
    const error = uploadedItem ? uploadedItem.error : ''

    let $contents
    let dispearMask = false
    if (inChibi === true) {
      $contents = <span className={styles["upload-info"]}>审核中</span>
    } else if (chibiFailed) {
      $contents = <span className={styles["upload-info"] + ' ' + styles["chibi-failed"]}>
        <AuditFailedIcon />
        <span>该图片涉及违禁</span>
        <span className={styles["re-audit-btn"]} onClick={() => reAuditImage(uploadedItem)}>点击申诉</span>
      </span>
    } else {
      if (status === 'uploading') {
        const radius = 25
        const percent100Len = Math.ceil(2 * 3.14 * radius)
        const exactPercent = percent ? Math.floor(percent) : 0
        $contents = <>
          <svg className={styles['progress']} width="60px" height="60px">
            <circle r="25" cy="30" cx="30" strokeWidth="3" stroke="rgba(0,0,0,0.5)" strokeLinejoin="round" strokeLinecap="round" fill="none" />
            <circle r="25" cy="30" cx="30" strokeWidth="3" stroke="#1790FF" strokeLinejoin="round" strokeLinecap="round" fill="none" strokeDashoffset="0px" strokeDasharray={percent100Len + 'px'} />
          </svg>
          <span className={styles["upload-info"]}>{exactPercent}%</span>
        </>
      } else if (status === 'error' || item.status === 'error') {
        $contents = <span className={styles["upload-info"] + ' ' + styles['error']} onClick={() => handleRemove(item)}>
          {error || '上传失败，点击删除'}
        </span>
      } else if (status === 'done') {
        if (preview) {
          dispearMask = true
          $contents = <>
            <div className={styles['upload-item-actions']}>
              <span className={styles['action']} onClick={() => handleRemove(item)}>
                <DeleteOutlined />
              </span>
            </div>
          </>
        } else {
          dispearMask = false
          $contents = <span className={styles["upload-info"]}>加载中</span>
        }
      } else if (!status) {
        dispearMask = true
      } else {
        // ...
      }
    }
    return (
      <div className={styles["upload-item"]} key={`${uid}-${idx}-${status}`}>
        <img className={styles["upload-img"]} src={preview} />
        <div className={styles["mask"] + (dispearMask ? styles['none'] : '')} />
        <div className={styles["wrapper"]}>{$contents}</div>
      </div>
    )
  }), [lists, uploadedLists, reRender])

  const showUploadBtn = (lists.length < MAX_UPLOAD_COUNT) && canUpload

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
        <Button className={styles["create-album-btn"]} type="text" size="small" onClick={handleCreateAlbum}>
          新增相册
        </Button>
      </div>

      {/* Container */}
      <div className={styles['upload-lists']}>
        {renderLists()}
        <div className={styles["upload-add"] + ' ' + (!showUploadBtn ? styles['hidden'] : '')}>
          <PlusOutlined />
          {$uploader}
        </div>
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

function AuditFailedIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 22 22" version="1.1">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-317.000000, -486.000000)">
        <g transform="translate(317.000000, 486.000000)">
          <circle fill="#F1492C" cx="11" cy="11" r="11" />
          <path d="M10.8217593,5.72916667 C11.2084864,5.72916667 11.5219907,6.04267098 11.5219907,6.42939815 L11.5211667,10.1211667 L15.2141204,10.1215278 C15.6008475,10.1215278 15.9143519,10.4350321 15.9143519,10.8217593 C15.9143519,11.2084864 15.6008475,11.5219907 15.2141204,11.5219907 L11.5211667,11.5211667 L11.5219907,15.2141204 C11.5219907,15.6008475 11.2084864,15.9143519 10.8217593,15.9143519 C10.4350321,15.9143519 10.1215278,15.6008475 10.1215278,15.2141204 L10.1211667,11.5211667 L6.42939815,11.5219907 C6.04267098,11.5219907 5.72916667,11.2084864 5.72916667,10.8217593 C5.72916667,10.4350321 6.04267098,10.1215278 6.42939815,10.1215278 L10.1211667,10.1211667 L10.1215278,6.42939815 C10.1215278,6.04267098 10.4350321,5.72916667 10.8217593,5.72916667 Z" id="形状结合" fill="#FFFFFF" transform="translate(10.821759, 10.821759) rotate(-45.000000) translate(-10.821759, -10.821759) " />
        </g>
      </g>
    </g>
  </svg>
}
