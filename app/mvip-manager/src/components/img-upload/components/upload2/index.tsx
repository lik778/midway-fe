import React, { useContext, FC } from 'react'
import styles from './index.less';
import AlbumModal from '@/components/img-upload/components/upload2/components/modal'
import ImgUploadContext  from '@/components/img-upload/context'
import ImgItem from '@/components/img-upload/components/img-item'
import UploadBtn from '@/components/img-upload/components/upload-btn'

const Upload2: FC = () => {
  const context = useContext(ImgUploadContext)
  const { fileList, initConfig: { maxSize, maxLength, uploadBeforeCrop, itemWidth, disabled, itemRender, showUploadList, actionBtn, uploadBtnText }, handleReloadFileList, handleChangeFileList, handlePreview, handleRemove, handleCrop } = context

  return <>
    <div className={styles['img-selected-list']}>
      {
        fileList.map((item, _index, arr) => <ImgItem file={item} fileList={arr || []} showUploadList={showUploadList} itemWidth={itemWidth} onPreview={handlePreview} onRemove={handleRemove} onCrop={handleCrop} actionBtn={actionBtn} key={item.uid}></ImgItem>)
      }
      {fileList.length < maxLength && <UploadBtn text={uploadBtnText} disabled={disabled} itemWidth={itemWidth} />}
    </div>
    <AlbumModal></AlbumModal></>
}

export default Upload2