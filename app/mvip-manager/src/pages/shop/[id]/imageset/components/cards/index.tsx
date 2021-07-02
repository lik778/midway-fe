import React, { useEffect, useState } from "react";
import { Button, Checkbox, Modal } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PartitionOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { successMessage, errorMessage } from "@/components/message";
import { delImagesetAlbum, delImagesetImage } from '@/api/shop'

import styles from "./index.less";

import { TabScope, CardItem, AlbumItem, ImageItem } from '../../types'

interface CardsProps {
  shopId: number;
  selection: any[];
  tabScope: TabScope;
  editAlbum: (album?: AlbumItem) => void;
  goImagePage: () => void;
  refresh: () => void;
}
export default function Cards(props: CardsProps) {

  /***************************************************** States */

  const { shopId, selection, tabScope, editAlbum, goImagePage, refresh } = props;
  const [lists] = useState([
    {
      id: 1,
      name: "默认相册1",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1?x=1",
      type: "image",
    },
    {
      id: 2,
      name: "默认相册2",
      count: 19,
      url: "http://img4.baixing.net/63becd57373449038fcbc3b599aecc8c.jpg_sv1",
      type: "image",
    },
    {
      id: 3,
      name: "默认相册3",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1?x=3",
      type: "image",
    }
  ]);
  const [previewURL, setPreviewURL] = useState("");
  const [previewModal, setPreviewModal] = useState(false);

  /***************************************************** Interaction Fns */

  const handleSelectCard = val => {
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
  const handleEditAlbum = (e: any, album: CardItem) => {
    editAlbum(album)
    e.stopPropagation()
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
            .then(res => {
              if (res.success) {
                successMessage('删除成功');
                refresh && refresh();
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

  /***************************************************** Renders */

  const AlbumCard = (card: CardItem) => {
    const { id, name, url } = card;
    const isChecked = tabScope === 'album' && selection.find((y: any) => y.id === id);
    return (
      <div className={styles["album-card"]} onClick={goImagePage}>
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
              <div className={styles["anticon-down-item"]} onClick={e => delAlbum(e, card as AlbumItem)}>
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
  const ImageCard = (card: CardItem) => {
    const { id, url } = card;
    const isChecked = tabScope === 'image' && selection.find((y: any) => y.id === id);
    return (
      <div className={styles["image-card"]} onClick={() => previewImage(url)}>
        <div className={styles["selection"]}>
          <Checkbox value={isChecked} onChange={handleSelectCard} />
          <div className={styles["anticon-down-con"]}>
            <div className={styles["anticon-down"]}>
              <DownOutlined />
            </div>
            <div className={styles["down-actions"]}>
              <div className={styles["anticon-down-item"]}>
                <PartitionOutlined />
                <span>移动</span>
              </div>
              <div className={styles["anticon-down-item"]} onClick={e => delImage(e, card as ImageItem)}>
                <DeleteOutlined />
                <span>删除</span>
              </div>
              <div className={styles["anticon-down-item"]}>
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
    switch (tabScope) {
      case "album":
        return AlbumCard(card);
      case "image":
        return ImageCard(card);
    }
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

      {/* Preview Image Modal */}
      {renderPreviewModal()}
    </>
  );
}
