import React, { useState, useEffect, FC } from 'react';
import styles from './index.less'
interface Props {
  className?: string
  visible: boolean,
}

// 用于列表tab的切换 缓存组件
const CacheComponent: FC<Props> = (props) => {
  const { visible, className, children } = props
  const [init, setInit] = useState<boolean>(false)
  useEffect(() => {
    if (visible) {
      setInit(true)
    }
  }, [visible])
  return <>
    {
      init && <div className={`${styles['cache-component-container']} ${className}`} style={{
        display: visible ? 'block' : 'none'
      }}>
        {
          children
        }
      </div>
    }
  </>
}

export default CacheComponent