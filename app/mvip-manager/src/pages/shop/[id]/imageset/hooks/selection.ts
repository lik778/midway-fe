import React, { useEffect, useState, useCallback } from "react";

type SelectionItem = number
type Selection = SelectionItem[]

export function useSelection() {

  /***************************************************** States */

  const [selection, setSelection] = useState<Selection>([])

  /***************************************************** Interactions */

  // 添加选取
  const select = useCallback((newItem: SelectionItem | SelectionItem[]) => {
    const newItems = Array.isArray(newItem) ? newItem : [newItem]
    setSelection([
      ...selection,
      ...newItems.filter(item => !selection.find(x => x === item))
    ])
  }, [selection])

  // 移除选取
  const unselect = useCallback((removeItem: SelectionItem | SelectionItem[]) => {
    const removeItems = Array.isArray(removeItem) ? removeItem : [removeItem]
    setSelection(selection.filter(x => !removeItems.includes(x)))
  }, [selection])

  return [
    selection,
    setSelection,
    select,
    unselect
  ] as const
}
