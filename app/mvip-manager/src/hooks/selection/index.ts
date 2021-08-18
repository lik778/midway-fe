import React, { useState, useCallback } from "react";

type SelectionItem = number
type Selection = SelectionItem[]

type Props = {
  // 排除选中（传入 SelectionItem，返回 true 则代表排除该项）
  excludeFilter?: (select: SelectionItem) => boolean;
}
export default function useSelection(props: Props = {}) {

  /***************************************************** States */

  const { excludeFilter = (_: SelectionItem) => false } = props
  const flipExcludeFilter = useCallback((x: SelectionItem) => !excludeFilter(x), [excludeFilter])
  const [selection, setSelection] = useState<Selection>([])

  /***************************************************** Interactions */

  // 添加选取
  const select = useCallback((newItem: SelectionItem | SelectionItem[]) => {
    const newItems = Array.isArray(newItem) ? newItem : [newItem]
    const results = [
      ...selection,
      ...newItems.filter(item => !selection.find(x => x === item))
    ].filter(flipExcludeFilter)
    setSelection(results)
  }, [selection, flipExcludeFilter])

  // 移除选取
  const unselect = useCallback((removeItem: SelectionItem | SelectionItem[]) => {
    const removeItems = Array.isArray(removeItem) ? removeItem : [removeItem]
    const results = selection
      .filter(x => !removeItems.includes(x))
      .filter(flipExcludeFilter)
    setSelection(results)
  }, [selection, flipExcludeFilter])

  return [
    selection,
    setSelection,
    select,
    unselect
  ] as const
}
