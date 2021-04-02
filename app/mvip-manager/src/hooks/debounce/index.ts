import React, { useState, useEffect, useRef } from 'react'
import { debounce, DebounceSettings } from 'lodash'

type Func = (...args: any) => any

export const useDebounce = <T extends Func>(func: T, wait?: number, options?: DebounceSettings) => {
  const funcRef = useRef(func)
  useEffect(() => {
    funcRef.current = func
  })
  const debounceFn = useRef(debounce(() => funcRef.current(), wait, options))
  return debounceFn.current
};