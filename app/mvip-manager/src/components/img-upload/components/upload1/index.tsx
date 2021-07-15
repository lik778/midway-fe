import React, { useMemo, useContext, FC } from 'react'
import { Upload, } from 'antd';
import { errorMessage } from '@/components/message';
import ImgUploadContext from '@/components/img-upload/context'
import { UploadFile, RcFile } from 'antd/lib/upload/interface'
import ImgItem from '@/components/img-upload/components/img-item'
import UploadBtn from '@/components/img-upload/components/upload-btn'
import { getFileBase64 } from '@/utils/index'


const Upload1: FC = () => {
  const context = useContext(ImgUploadContext)
  const { fileList, initConfig: { maxSize, maxLength, uploadBeforeCrop, itemWidth, disabled, itemRender, showUploadList, actionBtn, uploadBtnText }, handleReloadFileList, handleChangeFileList, handlePreview, handleRemove, handleCrop } = context

  const setCropItem = async (file: RcFile,) => {
    const filrUrl = await getFileBase64(file)
    const cropItem: UploadFile = { uid: file.uid, status: 'uploading', preview: filrUrl as string, size: 0, name: '', originFileObj: null as any, type: '', }
    handleCrop(cropItem, fileList.length)
  }

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      errorMessage('请上传jpg、jpeg、png格式的图片');
      return false
    }
    const overrun = file.size / 1024 / 1024 < maxSize;
    if (!overrun) {
      errorMessage(`请上传不超过${maxSize}M的图片`);
      return false
    }
    if (uploadBeforeCrop) {
      setCropItem(file)
      return false
    }
    return isJpgOrPng && overrun && !uploadBeforeCrop;
  }

  const handleChange = async (e: any) => {
    if (!!e.file.status) {
      if (e.file.status === 'done') {
        const nowFileList = e.fileList.map((item: any) => {
          if (item.url) {
            return item
          } else {
            return {
              ...item,
              url: item.response ? item.response.url : ''
            }
          }
        })
        handleChangeFileList(nowFileList, fileList.filter(item => item.uid !== e.file.uid), e.file)
      } else {
        handleReloadFileList([...e.fileList])
      }
    }
  }

  return <Upload
    action={window.__upyunImgConfig?.uploadUrl}
    data={{
      policy: window.__upyunImgConfig?.uploadParams?.policy,
      signature: window.__upyunImgConfig?.uploadParams?.signature
    }}
    style={{ width: itemWidth }}
    listType="picture-card"
    fileList={fileList}
    beforeUpload={beforeUpload}
    onChange={handleChange}
    isImageUrl={(file) => { return true }}
    disabled={disabled}
    itemRender={itemRender ? itemRender : (originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => <ImgItem fileIndex={(fileList || []).findIndex(item => item.uid === file.uid)} file={file} fileList={fileList || []} showUploadList={showUploadList} itemWidth={itemWidth} onPreview={handlePreview} onRemove={handleRemove} onCrop={handleCrop} actionBtn={actionBtn}></ImgItem>}
  >
    {
      fileList.length < maxLength && <UploadBtn text={uploadBtnText} disabled={disabled} itemWidth={itemWidth} />
    }
  </Upload >
}

export default Upload1