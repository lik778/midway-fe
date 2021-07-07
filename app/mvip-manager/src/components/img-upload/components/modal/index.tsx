import React, { useContext, useEffect, useState, FC } from 'react';
import styles from './index.less'
import AtlasModalHeader from './components/header'
import AtlasModalContent from './components/content'
import { ImgUploadContext } from '../../context'


interface Props { }

const Modal: FC<Props> = (props) => {
  // 第一次创建组件后缓存起来，模拟 antd modal 
  const context = useContext(ImgUploadContext)
  const { atlasVisible } = context
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
        <AtlasModalHeader></AtlasModalHeader>
        <AtlasModalContent></AtlasModalContent>
      </div>
    }
  </>
}

export default Modal