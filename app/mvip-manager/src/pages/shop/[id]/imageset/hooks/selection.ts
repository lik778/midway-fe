import React, { useState, useCallback } from "react";

type SelectionItem = number
type Selection = SelectionItem[]

type Props = {
  excludeFn?: (select: SelectionItem) => boolean;
}
export function useSelection(props?: Props) {

  /***************************************************** States */

  const { excludeFn = (_: SelectionItem) => true } = props || {}
  const flipExcludeFn = useCallback((x: SelectionItem) => !excludeFn(x), [excludeFn])
  const [selection, setSelection] = useState<Selection>([])

  /***************************************************** Interactions */

  // 添加选取
  const select = useCallback((newItem: SelectionItem | SelectionItem[]) => {
    const newItems = Array.isArray(newItem) ? newItem : [newItem]
    const results = [
      ...selection,
      ...newItems.filter(item => !selection.find(x => x === item))
    ].filter(flipExcludeFn)
    setSelection(results)
  }, [selection, flipExcludeFn])

  // 移除选取
  const unselect = useCallback((removeItem: SelectionItem | SelectionItem[]) => {
    const removeItems = Array.isArray(removeItem) ? removeItem : [removeItem]
    const results = selection
      .filter(x => !removeItems.includes(x))
      .filter(flipExcludeFn)
    setSelection(results)
  }, [selection, flipExcludeFn])

  return [
    selection,
    setSelection,
    select,
    unselect
  ] as const
}
