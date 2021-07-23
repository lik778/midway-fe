import React, { useEffect, useState, useCallback } from "react"
import { Spin, Button, Result, Checkbox, Modal } from "antd"
import {
  LeftOutlined,
  RightOutlined,
  PartitionOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  LoadingOutlined
} from "@ant-design/icons"

import { successMessage, errorMessage } from "@/components/message"
import { reAuditImagesetImage, delImagesetAlbum, delImagesetImage, delImagesetFailedImage, setImagesetAlbumCover, moveImagesetImage } from '@/api/shop'
import { useSelectAlbumListsModal } from '../select-album-modal'

import { TabScope, TabScopeItem, CardItem, AlbumItem, ImageItem, AlbumNameListItem } from "@/interfaces/shop"
import { PaginationSetting } from '../../hooks/pagination'

import styles from "./index.less"

import DEFAULT_ALBUM_COVER from '../../statics/default-album-cover.png'

interface CardsProps {
  shopId: number;
  lists: CardItem[];
  selection: any[];
  tabScope: TabScope;
  curScope: TabScopeItem | undefined;
  isScopeAudit: boolean;
  isScopeAlbum: boolean;
  isScopeImage: boolean;
  allAlbumLists: AlbumNameListItem[];
  loading: boolean;
  pagiConf: any;
  setPagiConf: (conf: Partial<PaginationSetting>) => void;
  refreshAllAlbumLists: () => void;
  select: (id: number | number[]) => void;
  setSelection: (ids: number[]) => void;
  unselect: (id: number | number[]) => void;
  goTabScope: (scope: TabScopeItem) => void;
  editAlbum: (album?: AlbumItem) => void;
  openUpload: (defaultVal?: number) => void;
  refresh: (resetPagi?: boolean) => void;
}
export default function Cards(props: CardsProps) {

  /***************************************************** States */

  const { shopId, lists, selection, tabScope, curScope, isScopeAudit, isScopeAlbum, isScopeImage, allAlbumLists, loading, pagiConf, setPagiConf, refreshAllAlbumLists, setSelection, select, unselect, goTabScope, editAlbum, refresh, openUpload } = props;

  const [$selectAlbumModal, selectAlbum] = useSelectAlbumListsModal({ allAlbumLists })
  const [auditLoadingItem, setAuditLoadingItem] = useState<ImageItem|null>()

  const [previewItem, setPreviewItem] = useState<ImageItem|undefined>();
  const [previewModal, setPreviewModal] = useState(false);

  const [countInLine, setCountInLine] = useState(0)

  const checkMaxCountInLine = useCallback((width?: number) => {
    if (width) {
      const cardWidth = 220
      const gapMax = 46
      const gapMin = 36
      const tryCount = [3, 4, 5, 6, 7, 8]
      // FIXME type
      const result = tryCount.reduce((h, c) => {
        if (!h) {
          const maxWidthLimit = (cardWidth + gapMax) * c - gapMax
          const minWidthLimit = (cardWidth + gapMin) * c - gapMin
          const isFit = ((width > minWidthLimit) && (width < maxWidthLimit))
          if (isFit) return c
          const isBigger = width < minWidthLimit
          if (isBigger) {
            const last = tryCount.find((x, i) => tryCount[i+1] === c)
            return last
          }
        }
        return h
      }, 0) || tryCount[0]
      if (countInLine !== result) {
        setCountInLine(result)
      }
      const countInPage = result * 2
      if (pagiConf.pageSize !== countInPage) {
        setPagiConf({
          pageSize: countInPage,
          pageSizeOptions: [
            String(countInPage),
            String(countInPage * 2),
            String(countInPage * 4),
          ]
        })
      }
    }
  }, [countInLine])

  /***************************************************** Interaction Fns */

  const stopEvent = (e: any) => e.stopPropagation()

  const previewImage = (image: ImageItem) => {
    setPreviewItem(image)
    setPreviewModal(true)
  }
  const closePreviewModal = () => {
    setPreviewItem(undefined)
    setPreviewModal(false)
  }
  const handleEditAlbum = async (e: any, album: AlbumItem) => {
    e.stopPropagation()
    editAlbum(album)
  }

  // 查看相册详情
  const goAlbumScope = (album: AlbumItem) => {
    goTabScope({
      type: 'image',
      item: album
    })
  }

  // 选中/取消选中卡片
  const handleSelectCard = (e: any, card: CardItem) => {
    const { id } = card
    if (e.target.checked) {
      select(id)
    } else {
      unselect(id)
    }
  };

  /***************************************************** API Calls */

  // 删除确认 Modal
  const delCallback = useCallback(async (api: any, query: any, info: string, callback?: () => void) => {
    Modal.confirm({
      title: '确认删除',
      content: info,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          api(shopId, query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功');
                callback && callback()
                resolve(res.success)
              } else {
                throw new Error(res.message || "出错啦，请稍后重试");
              }
            })
            .catch((error: any) => {
              errorMessage(error.message)
              setTimeout(reject, 1000)
            })
        })
      }
    })
  }, [lists])

  // 删除相册
  const delAlbum = useCallback(async (e: any, album: AlbumItem) => {
    e.stopPropagation()
    const { id, totalImg } = album
    const info = totalImg === 0
      ? `相册删除后无法恢复，确认删除？`
      : `本次预计删除 ${totalImg} 张图片，删除后无法恢复，确认删除？`
    await delCallback(delImagesetAlbum, [id], info, () => {
      setSelection(selection.filter(x => x !== id))
      refreshAllAlbumLists()
      // TODO 在选区删除时也这么判断一下，现在是 refresh(true)
      refresh(lists.length === 1)
    })
  }, [selection, lists, refresh])

  // 删除图片
  const delImage = useCallback(async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    const delMethod = curScope?.type === 'image'
      ? delImagesetImage
      : delImagesetFailedImage
    const info = `图片删除后无法恢复，确认删除？`
    await delCallback(delMethod, { ids: [id], mediaCateId: curScope?.item?.id }, info, () => {
      setSelection(selection.filter(x => x !== id))
      refresh(lists.length === 1)
    })
  }, [selection, lists, curScope, refresh])

  // 申诉图片
  const reAuditImage = useCallback(async (e: any, image: ImageItem) => {
    setAuditLoadingItem(image)
    e.stopPropagation()
    if (!curScope) {
      return
    }
    reAuditImagesetImage(shopId, { id: image.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('申诉成功')
          refresh()
        } else {
          throw new Error(res.message || '出错啦，请稍后重试')
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
      .finally(() => {
        setAuditLoadingItem(null)
      })
  }, [curScope, lists])

  // 移动图片
  const moveImage = useCallback(async (e: any, image: ImageItem) => {
    e.stopPropagation()
    if (!curScope) {
      return
    }
    const { id } = image
    const album = await selectAlbum({
      exclude: curScope.item ? [curScope?.item?.id] : []
    })
    const resetRefreshPagi = lists.length === 1
    moveImagesetImage(shopId, { id, mediaCateId: album.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('移动成功');
          setSelection(selection.filter(x => x !== id))
          refresh(resetRefreshPagi)
        } else {
          throw new Error(res.message || "出错啦，请稍后重试");
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
  }, [shopId, selection, curScope, lists, refresh])

  // 设置封面图片
  const setCoverImage = useCallback(async (e: any, image: ImageItem) => {
    e.stopPropagation()
    if (curScope && curScope.item) {
      const { id } = image
      const { item } = curScope
      setImagesetAlbumCover(shopId, { id, mediaCateId: item.id })
        .then((res: any) => {
          if (res.success) {
            successMessage('设置成功');
          } else {
            throw new Error(res.message || "出错啦，请稍后重试");
          }
        })
        .catch((error: any) => {
          errorMessage(error.message)
        })
    } else {
      console.warn('[WARN] Empty Scope in function setCoverImage')
    }
  }, [curScope])

  /***************************************************** Renders */

  const AlbumCard = useCallback((card: AlbumItem) => {
    const { id, name, coverUrl, totalImg, type } = card;
    const isDefaultAlbum = type === 'DEFAULT'
    const isChecked = isScopeAlbum && selection.find((y: number) => y === id);
    return (
      <div className={styles["album-card"]} onClick={() => goAlbumScope(card)} key={`album-card-${id}`}>
        {!isDefaultAlbum && (
          <div className={styles["selection"]} onClick={e => stopEvent(e)}>
            <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} />
            <div className={styles["anticon-down-con"]}>
              <div className={styles["anticon-down"]}>
                <DownOutlined />
              </div>
              <div className={styles["down-actions"]}>
                <div className={styles["anticon-down-item"]} onClick={e => handleEditAlbum(e, card)}>
                  <EditOutlined />
                  <span>编辑</span>
                </div>
                <div className={styles["anticon-down-item"]} onClick={e => delAlbum(e, card)}>
                  <DeleteOutlined />
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <img className={styles["cover"]} src={coverUrl || DEFAULT_ALBUM_COVER} alt="cover" />
        <div className={styles["header"]}>
          <span className={styles["name"]} title={name}>{name}</span>
          <span>
            <span>{totalImg}</span> 张
          </span>
        </div>
      </div>
    );
  }, [selection])

  const ImageCard = useCallback((card: ImageItem) => {
    const { id, imgUrl } = card;
    const isChecked = isScopeImage && selection.find((y: number) => y === id);
    return (
      <div className={styles["image-card"]} onClick={() => previewImage(card)} key={`image-card-${id}`}>
        <div className={styles["selection"]} onClick={e => stopEvent(e)}>
          <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} />
          <div className={styles["anticon-down-con"]}>
            <div className={styles["anticon-down"]}>
              <DownOutlined />
            </div>
            <div className={styles["down-actions"]} onClick={e => moveImage(e, card)}>
              <div className={styles["anticon-down-item"]}>
                <PartitionOutlined />
                <span>移动</span>
              </div>
              <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card)}>
                <DeleteOutlined />
                <span>删除</span>
              </div>
              <div className={styles["anticon-down-item"]} onClick={e => setCoverImage(e, card)}>
                <EditOutlined />
                <span>设为封面</span>
              </div>
            </div>
          </div>
        </div>
        {(!loading && imgUrl) && (
          <img className={styles["cover"]} src={imgUrl} alt="cover" />
        )}
      </div>
    );
  }, [selection, loading])

  const ErrorImageCard = useCallback((card: ImageItem) => {
    const { id, imgUrl, checkStatus } = card;
    const isChecked = isScopeAudit && selection.find((y: number) => y === id)
    const inAudit = checkStatus === 'REAPPLY'
    const inAuditLoading = auditLoadingItem && auditLoadingItem.id === id
    const rejected = ['REJECT_BYMACHINE', 'REJECT_BYHUMAN'].includes(checkStatus)
    const showCoverInfo = inAudit || rejected
    return (
      <div className={styles["error-image-card"]} onClick={() => previewImage(card)} key={`error-image-card-${id}`}>
        {!inAudit && (
          <div className={styles["selection"]} onClick={e => stopEvent(e)}>
            <Checkbox checked={isChecked} onChange={e => handleSelectCard(e, card)} />
            <div className={styles["anticon-down-con"]}>
              <div className={styles["anticon-down"]}>
                <DownOutlined />
              </div>
              <div className={styles["down-actions"]} onClick={e => moveImage(e, card)}>
                <div className={styles["anticon-down-item"]} onClick={e => reAuditImage(e, card)}>
                  {inAuditLoading ? <LoadingOutlined /> : <ReApplyIcon />}
                  <span>申诉</span>
                </div>
                <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card)}>
                  <DeleteOutlined />
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {(!loading && imgUrl) && (
          <img className={styles["cover"]} src={imgUrl} alt="cover" />
        )}
        {showCoverInfo && (
          <div className={styles["mask"]}>
            {rejected && <AuditFailedIcon />}
            {inAudit ? '审核中' : rejected ? '审核不通过' : ''}
          </div>
        )}
      </div>
    )
  }, [selection, loading, auditLoadingItem])

  // 根据文件夹类型的不同渲染不同的卡片
  const renderCard = (card: CardItem) => {
    if (isScopeAlbum) {
      return AlbumCard(card as AlbumItem)
    }
    if (isScopeImage) {
      return ImageCard(card as ImageItem)
    }
    if (isScopeAudit) {
      return ErrorImageCard(card as ImageItem)
    }
    console.error('[ERR] Error TabScope Rendered')
  }

  const renderPreviewModal = () => {
    if (!previewItem) {
      return
    }
    const target = lists.find(x => x.id === previewItem.id)
    const targetIDX = lists.findIndex(x => x === target)
    const prev = lists[targetIDX - 1]
    const next = lists[targetIDX + 1]
    return (
      <Modal
        wrapClassName="image-preview-modal"
        width="100vw"
        footer={null}
        visible={previewModal}
        onCancel={closePreviewModal}
      >
        <div className={"image-wrapper " + ((previewModal && previewItem) ? 'active' : '')}>
          <img src={previewItem.imgUrl} alt="预览图片" />
          {prev && <LeftOutlined title="上一张" onClick={() => previewImage(prev as ImageItem)} />}
          {next && <RightOutlined title="下一张" onClick={() => previewImage(next as ImageItem)} />}
        </div>
      </Modal>
    )
  }

  // 填充 flex 布局中未满的区域
  const renderFlexPadding = useCallback(() => {
    if (countInLine) {
      const padCount = countInLine - (lists.length % countInLine)
      if (padCount > 0 && padCount < countInLine) {
        return Array(padCount).fill('').map((x, i) => {
          return <div className={styles["padding-card"]} key={i} />
        })
      }
    }
  }, [countInLine, lists])

  // 空列表提示
  // * 目前至少有一个默认相册，所以相册列表不会为空
  const renderEmptyTip = useCallback(() => {
    if (!(isScopeAlbum || isScopeImage || isScopeAudit)) {
      return null
    }
    let info, $extra
    if (isScopeAlbum) {
      info = "没有找到相册，快新建一个吧~"
      $extra = <Button type="primary" onClick={() => editAlbum()}>新建相册</Button>
    }
    if (isScopeImage) {
      info = "当前相册还没有图片，快上传一些吧~"
      $extra = <Button type="primary" onClick={() => openUpload(curScope?.item?.id)}>上传图片</Button>
    }
    if (isScopeAudit) {
      info = "当前没有审核中的图片哦~"
      $extra = null
    }
    return  (
      <Result
        className={styles['info']}
        title={info}
        extra={$extra}
      />
    )
  }, [isScopeAlbum, isScopeImage, isScopeAudit, curScope])

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles["cards-con"]} ref={el => checkMaxCountInLine(el?.offsetWidth)}>
          {lists.map((x: any) => renderCard(x))}
          {renderFlexPadding()}
          {(lists.length === 0 && !loading) && renderEmptyTip()}
        </div>
      </Spin>
      {renderPreviewModal()}
      {$selectAlbumModal}
    </>
  )
}

function ReApplyIcon () {
  return <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h14v14H0z" />
      <path
        d="M5.782 5.17c.269 0 .487.225.487.502a.494.494 0 01-.487.502H3.447a.493.493 0 01-.485-.5c0-.089.023-.176.066-.252a.493.493 0 01.426-.251H5.79h-.008zM2.966 3.59a.495.495 0 01.48-.495h3.502a.49.49 0 01.48.495v.014a.49.49 0 01-.48.494H3.445a.494.494 0 01-.479-.494v-.014zM2.33 0h8.354c.714-.01 1.304.574 1.323 1.31h.01v.431a.504.504 0 01-.242.432.458.458 0 01-.48 0 .503.503 0 01-.243-.432V1.34a.364.364 0 00-.365-.341H2.324a.364.364 0 00-.365.34v11.324a.364.364 0 00.365.341h8.36c.19.004.35-.146.365-.34v-.433a.503.503 0 01.236-.453.464.464 0 01.5 0 .51.51 0 01.236.453v.432c-.01.749-.605 1.347-1.331 1.338H2.33c-.723.004-1.316-.592-1.33-1.338V1.34C1.014.592 1.607-.005 2.331 0v.001zm3.555 8.8l.79.83.809.842 4.318-4.422L10.2 4.383 5.885 8.807V8.8zm2.276 2.383a.51.51 0 01-.032.704.473.473 0 01-.65 0L4.525 8.81a.512.512 0 010-.696A.469.469 0 015.2 8.1L9.526 3.67a.51.51 0 01.04-.703.472.472 0 01.642 0l1.487 1.546 1.48 1.533c.193.187.204.5.023.7a.47.47 0 01-.706-.003L10.67 8.608l3.168 3.345c.134.124.19.314.148.494a.482.482 0 01-.359.362.482.482 0 01-.48-.152L9.972 9.334l-1.81 1.852-.001-.002z"
        fill="#333" fillRule="nonzero" />
    </g>
  </svg>
}

function AuditFailedIcon () {
  return <svg className={styles['anticon']} xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 22 22" version="1.1">
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
