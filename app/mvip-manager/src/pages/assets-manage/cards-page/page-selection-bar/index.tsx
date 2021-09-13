import React, { useEffect, useState, useCallback, useMemo } from "react"
import { Checkbox } from "antd"

import { errorMessage } from "@/components/message"

import { CardItem, TabScopeItem } from "@/interfaces/shop"

import styles from './index.less'

interface SelectionBarProps {
  total: number
  selection: number[]
  lists: CardItem[]
  curScope: TabScopeItem | undefined
  // 仅当前项目计入计算
  selectFrom?: (cards: CardItem[]) => CardItem[]
  select: (id: number | number[]) => void
  unselect: (id: number | number[]) => void
  actions: JSX.Element[] | null
}
export default function SelectionBar(props: SelectionBarProps) {
  const {
    total, selection, lists, curScope,
    select, unselect, selectFrom,
    actions
  } = props

  const scopeLabel = useMemo(() => {
    if (!curScope) {
      return ''
    } else {
      return curScope.countLabel + curScope.label
    }
  }, [curScope])

  // 排除某些项目的选中
  const ids = useMemo(() => {
    return selectFrom
      ? selectFrom(lists).map(x => x.id)
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
      if (ids.length === 0) {
        errorMessage('当前页面没有可以选中的项目')
      } else {
        select(ids)
      }
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
        {actions}
        <span className={styles["count-info"]}>
          {total === 0 && (
            <span>暂无数据</span>
          )}
          {total > 0 && (
            <span>共 <span className={styles["count-num"]}>{total}</span> {scopeLabel}</span>
          )}
        </span>
      </div>
      {
        curScope?.type === 'image' && <div className={styles['tip']}>本列表页仅展示审核通过的视频/图片，审核失败的视频/图片请在“申诉列表”查看。</div>
      }
    </>
  )
}
