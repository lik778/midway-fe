import React, { useContext, FC } from 'react'
import styles from './index.less';
import ImgUploadContext from '@/components/img-upload/context'


const Upload3: FC = (props) => {
  const { children } = props
  const context = useContext(ImgUploadContext)
  const { fileList, initConfig: { maxLength, itemWidth, disabled, showUploadList, actionBtn, uploadBtnText }, handlePreview, handleRemove, handleCrop, handleSelectCover, handleMove, handleChangeAlbumVisible } = context

  const handleClickBtn = () => {
    handleChangeAlbumVisible(true)
  }

  const getDecoratedChildren = () => {
    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return null
      }
      const childProps = {
        ...child.props,
        onClick: handleClickBtn
      }
      return React.cloneElement(child, childProps)
    })
  }

  return <>
    {
      getDecoratedChildren()
    }
  </>
}

export default Upload3