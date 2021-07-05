import React, { useEffect, useState, useCallback } from 'react';

type Pagination = {
  current: number
}
type PaginationSetting = {
  total: number
  pageSize: number
  pageSizeOptions: string[]
}

const getDefaultConf = (defaultVals: Partial<PaginationSetting>) => {
  const { pageSizeOptions = [] } = defaultVals
  return {
    total: 1,
    pageSizeOptions: pageSizeOptions || ['10', '25', '50'],
    pageSize: +pageSizeOptions[0] || 10,
  }
}

const getDefaultData = () => {
  return {
    current: 1,
  }
}

export function usePagination(defaultVals: Partial<PaginationSetting>) {
  const [conf, setConf] = useState<PaginationSetting>(getDefaultConf(defaultVals))
  const [data, setData] = useState<Pagination>(getDefaultData())

  const reset = () => {
    // setConf(getDefaultConf(defaultVals))
    setData(getDefaultData())
  }

  return [data, setData, conf, setConf, reset] as const
}
