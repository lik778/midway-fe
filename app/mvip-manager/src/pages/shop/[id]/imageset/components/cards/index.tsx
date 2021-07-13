import React, { useEffect, useState, useCallback } from "react";
import { Spin, Button, Result, Checkbox, Modal } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PartitionOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";

import { successMessage, errorMessage } from "@/components/message";
import { delImagesetAlbum, delImagesetImage, setImagesetAlbumCover, moveImagesetImage, createImagesetAlbum } from '@/api/shop'
import { useSelectAlbumListsModal } from '../select-album-modal'

import { TabScope, TabScopeItem, CardItem, AlbumItem, ImageItem, AlbumNameListItem } from "@/interfaces/shop";

import styles from "./index.less";

import DEFAULT_ALBUM_COVER from '../../statics/default-album-cover.png'

interface CardsProps {
  shopId: number;
  lists: CardItem[];
  selection: any[];
  tabScope: TabScope;
  curScope: TabScopeItem | undefined;
  isScopeAlbum: boolean;
  isScopeImage: boolean;
  allAlbumLists: AlbumNameListItem[];
  loading: boolean;
  refreshAllAlbumLists: () => void;
  select: (id: number | number[]) => void;
  setSelection: (ids: number[]) => void;
  unselect: (id: number | number[]) => void;
  goTabScope: (scope: TabScopeItem) => void;
  editAlbum: (album?: AlbumItem) => void;
  refresh: () => void;
  openUpload: (defaultVal?: number) => void;
}
export default function Cards(props: CardsProps) {

  /***************************************************** States */

  const { shopId, lists, selection, tabScope, curScope, isScopeAlbum, isScopeImage, allAlbumLists, loading, refreshAllAlbumLists, setSelection, select, unselect, goTabScope, editAlbum, refresh, openUpload } = props;

  const [$selectAlbumModal, selectAlbum] = useSelectAlbumListsModal({ allAlbumLists })

  const [previewItem, setPreviewItem] = useState<ImageItem|undefined>();
  const [previewModal, setPreviewModal] = useState(false);

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
  const delCallback = async (api: any, query: any, info: string, callback?: () => void) => {
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
                refresh();
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
  }

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
    })
  }, [selection])

  // 删除图片
  const delImage = useCallback(async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    const info = `图片删除后无法恢复，确认删除？`
    await delCallback(delImagesetImage, { ids: [id], mediaCateId: curScope?.item?.id }, info, () => {
      setSelection(selection.filter(x => x !== id))
    })
  }, [selection])

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
    moveImagesetImage(shopId, { id, mediaCateId: album.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('移动成功');
          setSelection(selection.filter(x => x !== id))
          refresh()
        } else {
          throw new Error(res.message || "出错啦，请稍后重试");
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
  }, [shopId, selection, curScope])

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

  const renderCard = (card: CardItem) => {
    if (isScopeAlbum) {
      return AlbumCard(card as AlbumItem);
    }
    if (isScopeImage) {
      return ImageCard(card as ImageItem);
    }
    console.error('[ERR] Error TabScope Rendered')
  };

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

  // 空列表提示
  // * 目前至少有一个默认相册，所以相册列表不会为空
  const renderEmptyTip = useCallback(() => {
    if (!isScopeAlbum && !isScopeImage) {
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
    return  (
      <Result
        className={styles['info']}
        title={info}
        extra={$extra}
      />
    )
  }, [isScopeAlbum, isScopeImage, curScope])

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles["cards-con"]}>
          {lists.map((x: any) => renderCard(x))}
          {(lists.length === 0 && !loading) && renderEmptyTip()}
        </div>
      </Spin>
      {renderPreviewModal()}
      {$selectAlbumModal}
    </>
  );
}
