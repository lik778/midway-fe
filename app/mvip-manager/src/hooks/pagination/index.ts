import React, { useEffect, useState, useCallback } from 'react';

export type Pagination = {
  current: number
}
export type PaginationSetting = {
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

export default function usePagination(defaultVals: Partial<PaginationSetting>) {
  const [conf, setConf] = useState<PaginationSetting>(getDefaultConf(defaultVals))
  const [data, setData] = useState<Pagination>(getDefaultData())

  const reset = () => {
    setData(getDefaultData())
  }
  const resetConf = useCallback((newConf: Partial<PaginationSetting>) => {
    setConf(Object.assign(conf, newConf))
  }, [conf])

  return [data, setData, conf, resetConf, reset] as const
}
