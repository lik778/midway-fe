import React, { useEffect, useState } from "react";
import { Button, Checkbox, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";

import styles from "./index.less";

interface CardsProps {
  // TODO
  selection: any[];
}
export default function Cards(props: CardsProps) {
  const { selection } = props;
  const [lists] = useState([
    {
      id: 1,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
    {
      id: 2,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
    {
      id: 3,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
    {
      id: 3,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
    {
      id: 3,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
    {
      id: 3,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
    {
      id: 3,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
    {
      id: 3,
      name: "默认相册",
      count: 19,
      url: "http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1",
      type: "image",
    },
  ]);
  const handleSelectCard = val => {
    console.log(val);
  };
  const AlbumCard = (card: any) => {
    const { id, name, url } = card;
    const isChecked = selection.find((y: any) => y.id === id);
    return (
      <div className={styles["album-card"]}>
        <div className={styles["selection"]}>
          <Checkbox value={isChecked} onChange={handleSelectCard} />
          <DownOutlined className={styles["anticon-down"]} />
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
  return (
    <div className={styles["cards-con"]}>
      {lists.map((x: any) => AlbumCard(x))}
    </div>
  );
}
