import React, { useContext, useEffect, useState, FC } from 'react';
import { UploadFile } from 'antd/lib/upload/interface';
import AlbumModalContent from './components/content'
import AlbumModalFooter from './components/footer'
import ImgUploadContext from '@/components/img-upload/context'
import CacheComponent from '@/components/cache-component'
import SelectModalContext from '@/components/img-upload/components/select-modal/context'
import { SelectModalProps } from './data'
import styles from './index.less'

const SelectModal: FC<SelectModalProps> = (props) => {
  const { showVideo, maxLength, fileList, handleChangeFileList } = props
  // 第一次创建组件后缓存起来，模拟 antd modal 
  const context = useContext(ImgUploadContext)
  const { albumVisible } = context
  // context 需要
  const [localFileList, setLocalFileList] = useState<UploadFile[]>([])
  // 预选择图片
  const handleChangeLocalFileList = (newLocalFileList: UploadFile[]) => {
    setLocalFileList(newLocalFileList)
  }

  // 初始化弹窗 开始
  useEffect(() => {
    if (albumVisible) {
      handleChangeLocalFileList([...fileList])
    }
  }, [albumVisible])
  // 初始化弹窗 结束

  return <>
    <CacheComponent visible={albumVisible}>
      <SelectModalContext.Provider value={{
        showVideo,
        maxLength,
        localFileList,
        handleChangeLocalFileList
      }}>
        <div className={styles['img-upload-modal-mask']}>
          <div className={styles['img-upload-modal']}>
            <AlbumModalContent ></AlbumModalContent>
            <AlbumModalFooter fileList={fileList} handleChangeFileList={handleChangeFileList}></AlbumModalFooter>
          </div>
        </div>
      </SelectModalContext.Provider>
    </CacheComponent>
  </>
}

export default SelectModal