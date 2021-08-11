import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Checkbox, Modal } from "antd";

import { successMessage, errorMessage } from "@/components/message";
import { delImagesetAlbumApi, delImagesetImageApi, delImagesetFailedImageApi } from '@/api/shop'

import { CardItem, AlbumItem, ImageItem, TabScopeItem } from "@/interfaces/shop";

import styles from './index.less'

interface SelectionBlockProps {
  shopId: number;
  total: number;
  selection: any[];
  lists: CardItem[];
  curScope: TabScopeItem | undefined;
  isScopeAlbum: boolean;
  isScopeAudit: boolean;
  refreshAllAlbumLists: () => void;
  select: (id: number | number[]) => void;
  unselect: (id: number | number[]) => void;
  setSelection: (ids: number[]) => void;
  refresh: (resetPagi?: boolean) => void;
}
export default function SelectionBlock(props: SelectionBlockProps) {
  const { shopId, total, selection, lists, isScopeAlbum, isScopeAudit, curScope, refreshAllAlbumLists, select, unselect, setSelection, refresh } = props

  // 排除默认相册和正在审核中的项目
  const ids = useMemo(() => {
    const all = isScopeAlbum
    ? lists.filter(x => (x as AlbumItem).type !== 'DEFAULT').map(x => x.id)
    : lists.filter(x => (x as ImageItem).checkStatus !== 'REAPPLY').map(x => x.id)
    return all
  }, [lists, isScopeAlbum])

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
    // 批量删除时必定重新刷新页面分页参数，
    // 因为不知道删了啥，删了之后这也还存不存在
    const resetFreshPage = true
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
            ? delImagesetAlbumApi
            : isScopeAudit
            ? delImagesetFailedImageApi
            : delImagesetImageApi
          const query: any = isScopeAlbum
            ? [...selection]
            : { ids: [...selection], mediaCateId: curScope?.item?.id }
          deleteFn(shopId, query)
            .then((res: any) => {
              if (res.success) {
                successMessage('删除成功');
                setSelection([])
                refresh(resetFreshPage)
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
  }, [shopId, isScopeAlbum, isScopeAudit, selection, curScope, lists, refresh])

  return (
    <>
      <div className={styles["section-block"]}>
        <Checkbox checked={checked} indeterminate={indeterminate} onChange={checkAll}>
          本页全选
        </Checkbox>
        {(selection.length > 0) && (
          <span className={styles["selection-count"]}>
            （共选中 <span className={styles["count-num"]}>{selection.length}</span> {isScopeAlbum ? '个相册' : '张图片'}）
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
