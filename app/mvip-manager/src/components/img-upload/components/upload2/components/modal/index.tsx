import React, { useContext, useEffect, useState, FC } from 'react';
import styles from './index.less'
import AlbumModalHeader from './components/header'
import AlbumModalContent from './components/content'
import AlbumModalFooter from './components/footer'
import ImgUploadContext from '@/components/img-upload/context'


interface Props { }

const Modal: FC<Props> = (props) => {
  // 第一次创建组件后缓存起来，模拟 antd modal 
  const context = useContext(ImgUploadContext)
  const { albumVisible } = context
  const [init, setInit] = useState<boolean>(false)
  useEffect(() => {
    if (albumVisible) {
      setInit(true)
    }
  }, [albumVisible])

  return <>
    {
      init && <div className={styles['img-upload-modal']} style={{
        display: albumVisible ? 'block' : 'none'
      }}>
        <AlbumModalHeader></AlbumModalHeader>
        <AlbumModalContent></AlbumModalContent>
        <AlbumModalFooter></AlbumModalFooter>
      </div>
    }
  </>
}

export default Modal