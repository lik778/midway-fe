import React, { useEffect, useState, useCallback } from 'react';

type Pagination = {
  current: number
}
type PaginationSetting = {
  total: number
  pageSize: number
}

export function usePagination() {
  const [conf, setConf] = useState<PaginationSetting>({
    total: 1,
    pageSize: 10
  })
  const [data, setData] = useState<Pagination>({
    current: 1,
  })

  return [data, setData, conf, setConf]
}
