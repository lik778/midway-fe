import React, { useContext, useEffect, useState, FC } from 'react';
import styles from './index.less'
import AlbumModalContent from './components/content'
import AlbumModalFooter from './components/footer'
import ImgUploadContext from '@/components/img-upload/context'
import CacheComponent from '@/components/cache-component'

interface Props { }

const Modal: FC<Props> = (props) => {
  // 第一次创建组件后缓存起来，模拟 antd modal 
  const context = useContext(ImgUploadContext)
  const { albumVisible } = context

  return <>
    <CacheComponent visible={albumVisible}>
      <div className={styles['img-upload-modal-mask']}>
        <div className={styles['img-upload-modal']}>
          <AlbumModalContent></AlbumModalContent>
          <AlbumModalFooter></AlbumModalFooter>
        </div>
      </div>
    </CacheComponent>
  </>
}

export default Modal