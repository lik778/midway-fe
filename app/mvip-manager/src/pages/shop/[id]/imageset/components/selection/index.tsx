import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Checkbox, Modal } from "antd";

import { successMessage, errorMessage } from "@/components/message";
import { delImagesetAlbum, delImagesetImage } from '@/api/shop'

import { CardItem, AlbumItem, TabScopeItem } from "@/interfaces/shop";

import styles from './index.less'

interface SelectionBlockProps {
  shopId: number;
  total: number;
  selection: any[];
  lists: CardItem[];
  curScope: TabScopeItem | undefined;
  isScopeAlbum: boolean;
  refreshAllAlbumLists: () => void;
  select: (id: number | number[]) => void;
  unselect: (id: number | number[]) => void;
  setSelection: (ids: number[]) => void;
  refresh: () => void;
}
export default function SelectionBlock(props: SelectionBlockProps) {
  const { shopId, total, selection, lists, isScopeAlbum, curScope, refreshAllAlbumLists, select, unselect, setSelection, refresh } = props

  // 不包含默认相册的列表项目的 ID
  const ids = useMemo(() => {
    const all = isScopeAlbum
      ? lists.filter(x => (x as AlbumItem).type !== 'DEFAULT').map(x => x.id)
      : lists.map(x => x.id)
    return all
  }, [lists, isScopeAlbum])

  /* 控制全选框的样式 */
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  useEffect(() => {
    // 选中时排除默认相册
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
  const checkAll = useCallback((e: any) => {
    e.stopPropagation()
    const isCheck = e.target.checked
    if (isCheck) {
      select(ids)
    } else {
      unselect(ids)
    }
  }, [ids])

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
          const deleteFn = isScopeAlbum
            ? delImagesetAlbum
            : delImagesetImage
          const query: any = isScopeAlbum
            ? [...selection]
            : { ids: [...selection], mediaCateId: curScope?.item?.id }
          deleteFn(shopId, query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功');
                setSelection([])
                refresh();
                refreshAllAlbumLists()
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
  }, [shopId, isScopeAlbum, selection, curScope])

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
          {total === 0 && (
            <span>暂无数据</span>
          )}
          {total > 0 && (
            <span>共 <span className={styles["count-num"]}>{total}</span> {isScopeAlbum ? '个相册' : '张图片'}</span>
          )}
        </span>
      </div>
    </>
  );
}
