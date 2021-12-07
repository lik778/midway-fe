import React, { useContext, FC } from 'react'
import styles from './index.less';
import ImgUploadContext from '@/components/img-upload/context'
import ImgItem from '@/components/img-upload/components/img-item'
import VideoItem from '@/components/img-upload/components/video-item'
import UploadBtn from '@/components/img-upload/components/upload-btn'

const Upload2: FC = () => {
  const context = useContext(ImgUploadContext)
  const { fileList, initConfig: { maxLength, itemWidth, disabled, showUploadList, actionBtn, uploadBtnText }, handlePreview, handleRemove, handleCrop, handleSelectCover, handleMove, handleChangeAlbumVisible, } = context

  return <>
    <div className={styles['img-selected-list']}>
      {
        fileList.map((item, index, arr) => {
          if (item.type === 'IMAGE') {
            return <ImgItem disabled={disabled} fileIndex={index} file={item} fileList={arr || []} showUploadList={showUploadList} itemWidth={itemWidth} onPreview={handlePreview} onRemove={handleRemove} onCrop={handleCrop} onMove={handleMove} actionBtn={actionBtn} key={`${item.uid}-${index}`}></ImgItem>
          } else if (item.type === 'VIDEO') {
            return <VideoItem disabled={disabled} fileIndex={index} file={item} fileList={arr || []} showUploadList={showUploadList} itemWidth={itemWidth} onPreview={handlePreview} onRemove={handleRemove} onMove={handleMove} onSelectCover={handleSelectCover} actionBtn={actionBtn} key={`${item.uid}-${index}`}></VideoItem>
          }
        })
      }
      {fileList.length < maxLength && <UploadBtn uploadType={2} text={uploadBtnText} disabled={disabled} itemWidth={itemWidth} handleChangeAlbumVisible={handleChangeAlbumVisible} />}
    </div>
  </>
}

export default Upload2