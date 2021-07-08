import React, { useEffect, useState, useCallback } from "react";
import { Button, Checkbox, Modal } from "antd";

import { successMessage, errorMessage } from "@/components/message";
import { delImagesetAlbum } from '@/api/shop'

import { CardItem } from "@/interfaces/shop";

import styles from './index.less'

interface SelectionBlockProps {
  shopId: number;
  total: number;
  selection: any[];
  lists: CardItem[];
  isScopeAlbum: boolean;
  select: (id: number | number[]) => void;
  unselect: (id: number | number[]) => void;
  setSelection: (ids: number[]) => void;
  refresh: () => void;
}
export default function SelectionBlock(props: SelectionBlockProps) {
  const { shopId, total, selection, lists, isScopeAlbum, select, unselect, setSelection, refresh } = props

  /* 控制全选框的样式 */
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  useEffect(() => {
    const all = lists.map(x => x.id)
    const allChecked = all.every(id => selection.includes(id))
    const noChecked = all.every(id => !selection.includes(id))
    if (allChecked && lists.length > 0) {
      setChecked(true)
      setIndeterminate(false)
    } else if (noChecked) {
      setChecked(false)
      setIndeterminate(false)
    } else {
      // partial selected
      setIndeterminate(true)
    }
  }, [selection, lists])

  // 全选/取消全选
  const checkAll = (e: any) => {
    e.stopPropagation()
    const isCheck = e.target.checked
    if (isCheck) {
      select(lists.map(x => x.id))
    } else {
      unselect(lists.map(x => x.id))
    }
  }

  // 批量删除卡片
  const deleteSelectionCards = useCallback((e: any) => {
    e.stopPropagation()
    const count = selection.length
    const info = count === 0
      ? `删除后无法恢复，确认删除？`
      : `本次预计删除 ${count} ${isScopeAlbum ? '个相册' : '张图片'}，删除后无法恢复，确认删除？`
    Modal.confirm({
      title: '确认删除',
      content: info,
      width: 532,
      onCancel() { },
      onOk() {
        return new Promise((resolve, reject) => {
          delImagesetAlbum(shopId, selection)
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
  }, [shopId, isScopeAlbum, selection])

  return (
    <>
      <div className={styles["section-block"]}>
        <Checkbox checked={checked} indeterminate={indeterminate} onChange={checkAll}>
          全选
        </Checkbox>
        {(selection.length > 0) && (
          <span className={styles["selection-count"]}>
            当前选中 <span className={styles["count-num"]}>{selection.length}</span> {isScopeAlbum ? '个相册' : '张图片'}
          </span>
        )}
        {(selection.length > 0) && (
          <Button className={styles["clear-selection-btn"]} type="text" size="small" onClick={() => setSelection([])}>
            清除选中
          </Button>
        )}
        {(selection.length > 0) && (
          <Button className={styles["delete-all-btn"]} type="text" size="small" onClick={(e) => deleteSelectionCards(e)}>
            批量删除
          </Button>
        )}
        <span className={styles["count-info"]}>
          共 <span className={styles["count-num"]}>{total}</span> {isScopeAlbum ? '个相册' : '张图片'}
        </span>
      </div>
    </>
  );
}
