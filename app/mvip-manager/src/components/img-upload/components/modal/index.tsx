import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
import { UploadFile } from 'antd/lib/upload/interface'
import styles from './index.less'

interface Props {
  atlasVisible: boolean

}

const Modal: FC<Props> = (props) => {
  // 第一次创建组件后缓存起来，模拟 antd modal 
  const { atlasVisible } = props
  const [init, setInit] = useState<boolean>(false)

  useEffect(() => {
    if (atlasVisible) {
      setInit(true)
    }
  }, [atlasVisible])

  return <>
    {
      init && <div className={styles['img-upload-modal']} style={{
        display: atlasVisible ? 'block' : 'none'
      }}>
        <div ></div>
      </div>
    }
  </>
}
export default Modal