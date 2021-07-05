import React, { useEffect, useState, useCallback } from "react";
import { Button, Checkbox, Modal } from "antd";

import styles from './index.less'

interface SelectionBlockProps {
  selection: any[];
  onSelectionChange: (selection: any[]) => void;
}
export default function SelectionBlock(props: SelectionBlockProps) {
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
