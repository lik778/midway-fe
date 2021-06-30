import React, { useEffect, useState } from 'react';
import { useParams } from "umi";
import { Button, Checkbox, Pagination } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import ContentHeader from "../components/content-header";
import ArticleNav from './components/nav'
import { ShopModuleType } from "@/enums";
import { RouteParams } from "@/interfaces/shop";

import styles from './index.less';

const ShopArticlePage = (props: any) => {

  /***************************************************** States */

  const params: RouteParams = useParams();
  const shopId = Number(params.id);
  const [selection, setSelection] = useState([])

  /***************************************************** Fns */

  const createAlbum = () => {}

  const uploadImage = () => {}

  /***************************************************** Templates */

  return (
    <>
      <ContentHeader {...props} type={ShopModuleType.ARTICLE} />
      <div className={`container ${styles["container"]}`}>
        <ArticleNav
          shopId={shopId}
          createAlbum={createAlbum}
          uploadImage={uploadImage}
        />
        <SelectionBlock
          selection={selection}
          onSelectionChange={val => setSelection(val)}
        />
        <Cards selection={selection} />
        <Pagination
          className={styles["pagination"]}
          defaultCurrent={1}
          total={500}
        />
      </div>
    </>
  );
}

interface SelectionBlockProps {
  selection: any[];
  onSelectionChange: (selection: any[]) => void;
}
function SelectionBlock (props: SelectionBlockProps) {
  const { selection, onSelectionChange } = props;
  const handleCheckAll = (e: any) => {
    console.log(e)
  }
  return (
    <>
      <div className={styles["section-block"]}>
        <Checkbox onChange={handleCheckAll}>全选</Checkbox>
        <Button className={styles["delete-all-btn"]} type="text" size="small">
          批量删除
        </Button>
        <span className={styles["count-info"]}>
          共 <span className={styles["count-num"]}>{selection.length}</span>{" "}
          个相册
        </span>
      </div>
    </>
  );
}

interface CardsProps {
  // TODO
  selection: any[]
}
function Cards (props: CardsProps) {
  const { selection } = props
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
    }
  ]);
  const handleSelectCard = (val) => {
    console.log(val)
  }
  const AlbumCard = (card: any) => {
    const { id, name, url } = card
    const isChecked = selection.find((y: any) => y.id === id)
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
    )
  }
  return <div className={styles['cards-con']}>
    {lists.map((x: any) => AlbumCard(x))}
  </div>
}

ShopArticlePage.wrappers = ['@/wrappers/path-auth']

export default ShopArticlePage
