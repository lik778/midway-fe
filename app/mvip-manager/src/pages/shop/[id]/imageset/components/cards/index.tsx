import React, { useEffect, useState } from "react";
import { Button, Checkbox, Modal } from "antd";
import {
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
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
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
  return (
    <>

      {/* Cards */}

      <div className={styles["cards-con"]}>
        {lists.map((x: any) => renderCard(x))}
      </div>

      {/* Preview Image Modal */}

      <Modal
        wrapClassName="image-preview-modal"
        width="100vw"
        footer={null}
        visible={previewModal}
        onCancel={() => setPreviewModal(false)}
      >
        <div className={"image-wrapper " + ((previewModal && previewURL) ? 'active' : '')}>
          <img src={previewURL} title="预览图片" />
        </div>
      </Modal>
    </>
  );
}
