import React, { useEffect, useState, useCallback } from "react";
import { Checkbox, Modal } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PartitionOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";

import { successMessage, errorMessage } from "@/components/message";
import { updateImagesetAlbum, delImagesetAlbum, delImagesetImage, updateImagesetImage } from '@/api/shop'
import { useSelectAlbumListsModal } from '../select-album-modal'

import styles from "./index.less";

import { TabScope, TabScopeItem, CardItem, AlbumItem, ImageItem } from '../../types'

interface CardsProps {
  shopId: number;
  lists: CardItem[];
  selection: any[];
  tabScope: TabScope;
  isScopeAlbum: boolean;
  isScopeImage: boolean;
  goTabScope: (scope: TabScopeItem) => void;
  editAlbum: (album?: AlbumItem) => void;
  refresh: () => void;
}
export default function Cards(props: CardsProps) {

  /***************************************************** States */

  const { shopId, lists, selection, tabScope, isScopeAlbum, isScopeImage, goTabScope, editAlbum, refresh } = props;

  const [$selectAlbumModal, selectAlbum] = useSelectAlbumListsModal()

  const [previewURL, setPreviewURL] = useState("");
  const [previewModal, setPreviewModal] = useState(false);

  const [curScope, setCurScope] = useState<TabScopeItem>();
  useEffect(() => {
    setCurScope(tabScope[tabScope.length - 1])
  }, [tabScope])

  /***************************************************** Interaction Fns */

  const handleSelectCard = (val: any) => {
    console.log(val);
  };
  const previewImage = (url: string) => {
    setPreviewURL(url)
    setPreviewModal(true)
  }
  const closePreviewModal = () => {
    setPreviewURL('')
    setPreviewModal(false)
  }
  const handleEditAlbum = (e: any, album: AlbumItem) => {
    editAlbum(album)
    e.stopPropagation()
  }

  const goAlbumDetail = (album: AlbumItem) => {
    goTabScope({
      type: 'image',
      item: album
    })
  }

  /***************************************************** API Calls */

  // 删除确认 Modal
  const delCallback = async (api: any, query: any, info: string) => {
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
  const delAlbum = async (e: any, album: AlbumItem) => {
    e.stopPropagation()
    const { id, count } = album
    const info = `本次预计删除 ${count} 张图片，删除后无法恢复，确认删除？`
    await delCallback(delImagesetAlbum, { id }, info)
  }
  // 删除图片
  const delImage = async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    const info = `删除后无法恢复，确认删除？`
    await delCallback(delImagesetImage, { id }, info)
  }

  // 移动图片
  const moveImage = async (e: any, image: ImageItem) => {
    e.stopPropagation()
    const { id } = image
    const album = await selectAlbum()
    updateImagesetImage(shopId, { id, albumID: album.id })
      .then((res: any) => {
        if (res.success) {
          successMessage('移动成功');
        } else {
          throw new Error(res.message || "出错啦，请稍后重试");
        }
      })
      .catch((error: any) => {
        errorMessage(error.message)
      })
    refresh()
  }

  // 设置封面图片
  const setCoverImage = useCallback(async (e: any, image: ImageItem) => {
    e.stopPropagation()
    if (curScope && curScope.item) {
      const { id } = image
      const { item } = curScope
      updateImagesetAlbum(shopId, { id: item.id, cover: id })
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

  const AlbumCard = (card: AlbumItem) => {
    const { id, name, url } = card;
    const isChecked = isScopeAlbum && selection.find((y: any) => y.id === id);
    return (
      <div className={styles["album-card"]} onClick={() => goAlbumDetail(card)}>
        <div className={styles["selection"]}>
          <Checkbox value={isChecked} onChange={handleSelectCard} />
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
        <img className={styles["cover"]} src={url} alt="cover" />
        <div className={styles["header"]}>
          <span className={styles["name"]}>{name}</span>
          <span>
            <span>{selection.length}</span> 张
          </span>
        </div>
      </div>
    );
  };
  const ImageCard = (card: ImageItem) => {
    const { id, url } = card;
    const isChecked = isScopeImage && selection.find((y: any) => y.id === id);
    return (
      <div className={styles["image-card"]} onClick={() => previewImage(url)}>
        <div className={styles["selection"]}>
          <Checkbox value={isChecked} onChange={handleSelectCard} />
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
        <img className={styles["cover"]} src={url} alt="cover" />
      </div>
    );
  };
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
    const target = lists.find(x => x.url === previewURL)
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
        <div className={"image-wrapper " + ((previewModal && previewURL) ? 'active' : '')}>
          <img src={previewURL} title="预览图片" />
          {prev && <LeftOutlined title="上一张" onClick={() => previewImage(prev.url)} />}
          {next && <RightOutlined title="下一张" onClick={() => previewImage(next.url)} />}
        </div>
      </Modal>
    )
  }
  return (
    <>
      {/* Cards */}
      <div className={styles["cards-con"]}>
        {lists.map((x: any) => renderCard(x))}
      </div>

      {/* Modals */}
      {renderPreviewModal()}
      {$selectAlbumModal}
    </>
  );
}
