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

import styles from "./index.less";

import { TabScope } from '../../index'

type CardItem = {
  id: number,
  name: string,
  url: string
}

interface CardsProps {
  // TODO
  selection: any[];
  tabScope: TabScope;
  goImagePage: () => void;
}
export default function Cards(props: CardsProps) {

  /***************************************************** States */

  const { selection, tabScope, goImagePage } = props;
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
  const [previewURL, setPreviewURL] = useState("http://img4.baixing.net/63becd57373449038fcbc3b599aecc8c.jpg_sv1");
  const [previewModal, setPreviewModal] = useState(true);

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
              <div className={styles["anticon-down-item"]}>
                <EditOutlined />
                <span>编辑</span>
              </div>
              <div className={styles["anticon-down-item"]}>
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
              <div className={styles["anticon-down-item"]}>
                <DeleteOutlined />
                <span>删除</span>
              </div>
              <div className={styles["anticon-down-item"]}>
                <EditOutlined />
                <span>删除</span>
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
