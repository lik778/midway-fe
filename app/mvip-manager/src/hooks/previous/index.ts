import React, { useRef, useEffect } from 'react'

export default function usePrevious(value: any, defaultValue: any) {
  const ref = useRef(defaultValue)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
