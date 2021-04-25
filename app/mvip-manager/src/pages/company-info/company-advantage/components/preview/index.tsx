import { CompanyAdvantageListItem } from '@/interfaces/user'
import { Tooltip } from 'antd'
import React, { FC, forwardRef, Ref, useEffect, useState } from 'react'
import styles from './index.less'
interface Props {
  color: 'black' | 'white',
}

const PreviewItem: FC<Props> = (props) => {
  const { color } = props

  return <div className={styles['text']}>示例预览
 <div className={styles['preview-box']}>
      <div className={styles['triangle']}></div>
      <div className={`${styles['preview-content']}`}>
        <img className={styles['image']} src={color === 'black' ? 'http://file.baixing.net/202104/b6b82316bcc5d1d30f79be07b7dca51f.png' : 'http://file.baixing.net/202104/e9c4492b667630d3b1d86f5659e13816.png'} alt="" />
      </div>
    </div>
  </div>
}


export default PreviewItem