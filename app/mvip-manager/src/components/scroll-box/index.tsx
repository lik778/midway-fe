import React, { ForwardRefRenderFunction, useState, useEffect, useRef, Ref } from 'react';
import styles from './index.less'
import { useDebounce } from '@/hooks/debounce';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';

interface Props {
  children?: any
  className?: string
  height?: string | number
  scrollY: boolean// 是否开启向下滚动事件
  handleScrollToLower?: (...arg: any) => void
}


const ScrollBox: ForwardRefRenderFunction<unknown, Props> = (props, parentRef) => {
  const { children, className, height, scrollY, handleScrollToLower } = props
  const ref = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(parentRef, () => ({
    scrollTop
  }));

  // 切换店铺图册滚动到顶部
  const scrollTop = () => {
    if (!ref.current) return
    ref.current.scrollTop = 0
  }

  const handleScroll: React.UIEventHandler<HTMLDivElement> = useDebounce((e) => {
    // 未滚动到底部
    if (!ref.current) return
    if ((ref.current.scrollHeight - ref.current.clientHeight) > ref.current.scrollTop) {
      //未到底
    } else {
      //已到底部
      if (scrollY) {
        handleScrollToLower && handleScrollToLower()
      }
    }
  }, 200)

  return <div className={`${className || ''} ${styles['scroll-box-container']}`} onScroll={handleScroll} ref={(dom) => ref.current = dom} style={{ height }}>
    {children}
  </div>
}

export default forwardRef(ScrollBox)