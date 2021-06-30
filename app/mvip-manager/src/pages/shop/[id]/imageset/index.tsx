import React, { useEffect, useState } from 'react';
import { useParams } from "umi";
import { Button, Checkbox, Pagination } from 'antd'

import ContentHeader from "../components/content-header";
import ArticleNav from './components/nav'
import Cards from './components/cards'
import { ShopModuleType } from "@/enums";
import { RouteParams } from "@/interfaces/shop";

import styles from './index.less';

const ShopArticlePage = (props: any) => {

  /***************************************************** States */

  const params: RouteParams = useParams();
  const shopId = Number(params.id);
  const [selection, setSelection] = useState([])

  /***************************************************** Fns */

  const getList = () => {}

  /***************************************************** Templates */

  return (
    <>
      <ContentHeader {...props} type={ShopModuleType.ARTICLE} />
      <div className={`container ${styles["container"]}`}>
        <ArticleNav
          shopId={shopId}
          refresh={getList}
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
  const { selection, onSelectionChange } = props

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

ShopArticlePage.wrappers = ['@/wrappers/path-auth']

export default ShopArticlePage
