import React, { useEffect, useState, useCallback, useMemo } from "react"
import { Button, Checkbox, Modal } from "antd"

import { successMessage, errorMessage } from "@/components/message"

import { CardItem, AlbumItem, ImageItem, TabScopeItem } from "@/interfaces/shop"

import styles from './index.less'

interface SelectionBlockProps {
  total: number;
  selection: any[];
  lists: CardItem[];
  curScope: TabScopeItem | undefined;
  deleteFn: (e: any) => void;
  excludes?: (cards: CardItem[]) => CardItem[]
  select: (id: number | number[]) => void;
  unselect: (id: number | number[]) => void;
  setSelection: (ids: number[]) => void;
  refresh: (resetPagi?: boolean) => void;
}
export default function SelectionBlock(props: SelectionBlockProps) {
  const {
    total, selection, lists, curScope,
    deleteFn, select, unselect, setSelection, refresh, excludes,
  } = props

  const scopeLabel = useMemo(() => {
    if (!curScope) {
      return ''
    } else {
      return curScope.label + curScope.countLabel
    }
  }, [curScope])

  // 排除某些项目的选中
  const ids = useMemo(() => {
    return excludes
      ? excludes(lists).map(x => x.id)
      : lists.map(x => x.id)
  }, [lists])

  /* 控制全选框的样式 */
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  useEffect(() => {
    const allChecked = ids.every(id => selection.includes(id))
    const noChecked = ids.every(id => !selection.includes(id))
    if (allChecked && ids.length > 0) {
      setChecked(true)
      setIndeterminate(false)
    } else if (noChecked) {
      setChecked(false)
      setIndeterminate(false)
    } else {
      // partial selected
      setIndeterminate(true)
    }
  }, [selection, ids])

  // 全选/取消全选
  const selectAll = useCallback((e: any) => {
    e.stopPropagation()
    const isCheck = e.target.checked
    if (isCheck) {
      select(ids)
    } else {
      unselect(ids)
    }
  }, [ids])

  return (
    <>
      <div className={styles["section-block"]}>
        <Checkbox checked={checked} indeterminate={indeterminate} onChange={selectAll}>
          本页全选
        </Checkbox>
        {(selection.length > 0) && (
          <span className={styles["selection-count"]}>
            （共选中 <span className={styles["count-num"]}>{selection.length}</span> {scopeLabel}）
          </span>
        )}
        {(selection.length > 0) && (
          <Button className={styles["clear-selection-btn"]} type="text" size="small" onClick={() => setSelection([])}>
            清除选中
          </Button>
        )}
        {(selection.length > 0) && (
          <Button className={styles["delete-all-btn"]} type="text" size="small" onClick={(e) => deleteFn(e)}>
            批量删除
          </Button>
        )}
        <span className={styles["count-info"]}>
          {total === 0 && (
            <span>暂无数据</span>
          )}
          {total > 0 && (
            <span>共 <span className={styles["count-num"]}>{total}</span> {scopeLabel}</span>
          )}
        </span>
      </div>
    </>
  );
}
