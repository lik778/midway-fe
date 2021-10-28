import React, { useMemo, useContext, FC } from 'react'
import { Upload, } from 'antd';
import { errorMessage } from '@/components/message';
import ImgUploadContext from '@/components/img-upload/context'
import { UploadChangeParam, UploadFile, RcFile } from 'antd/lib/upload/interface'
import ImgItem from '@/components/img-upload/components/img-item'
import UploadBtn from '@/components/img-upload/components/upload-btn'
import { getFileBase64 } from '@/utils/index'
import { ImgUploadContextInitConfig } from '@/components/img-upload/data'

interface Props {
  fileList: UploadFile<any>[]
  initConfig: ImgUploadContextInitConfig
  handleChangeFileList: (newFileList: UploadFile<any>[], oldFileList: UploadFile<any>[], file: UploadFile<any> | null) => void
  handlePreview?: (file: UploadFile<any>) => void
  handleRemove?: (file: UploadFile<any>, fileIndex: number) => void
  handleCrop?: (file: UploadFile<any>, fileIndex: number) => void
}

const Upload1: FC<Props> = (props) => {
  const { fileList, initConfig: { unique, maxSize, maxLength, uploadBeforeCrop, itemWidth, disabled, itemRender, showUploadList, actionBtn, uploadBtnText }, handleChangeFileList, handlePreview, handleRemove, handleCrop } = props

  const setCropItem = async (file: RcFile,) => {
    const filrUrl = await getFileBase64(file)
    const cropItem: UploadFile = { uid: file.uid, status: 'uploading', preview: filrUrl as string, size: 0, name: '', originFileObj: null as any, type: '', }
    handleCrop && handleCrop(cropItem, fileList.length)
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

  const checkUrlUnique = (fileList: UploadFile<any>[], url: string) => {
    return fileList.some(item => item.url?.indexOf(url) !== -1)
  }

  const handleChange = async (e: UploadChangeParam<UploadFile<any>>) => {
    if (!!e.file.status) {
      const oldFileList = fileList.filter(item => item.uid !== e.file.uid)
      // 在禁止选择重复图片时需要在 status===’done‘下检查重复
      if (e.file.status === 'done' && unique && checkUrlUnique(oldFileList, e.file.response.url)) {
        handleChangeFileList(oldFileList, oldFileList, e.file)
        errorMessage('请勿上传重复图片')
      } else {
        const nowFileList = e.fileList.map((item: any) => {
          if (item.url) {
            return {
              ...item,
              type: 'IMAGE'
            }
          } else {
            return {
              ...item,
              url: item.response ? item.response.url : '',
              type: 'IMAGE'
            }
          }
        })
        handleChangeFileList(nowFileList, oldFileList, e.file)
      }
    }
  }

  return <Upload
    action={window.__upyunImgConfig?.uploadUrl}
    data={{
      policy: window.__upyunImgConfig?.uploadParams?.policy,
      signature: window.__upyunImgConfig?.uploadParams?.signature
    }}
    accept="image/jpeg,image/jpg,image/png"
    style={{ width: itemWidth }}
    listType="picture-card"
    fileList={fileList}
    beforeUpload={beforeUpload}
    onChange={handleChange}
    isImageUrl={(file) => { return true }}
    disabled={disabled}
    //  itemRender 与 onRemove onCrop 是互斥的  
    itemRender={itemRender ? itemRender : (originNode: React.ReactElement, file: UploadFile, fileList?: Array<UploadFile<any>>) => <ImgItem disabled={disabled} fileIndex={(fileList || []).findIndex(item => item.uid === file.uid)} file={file} fileList={fileList || []} showUploadList={showUploadList} itemWidth={itemWidth} onPreview={handlePreview!} onRemove={handleRemove!} onCrop={handleCrop} actionBtn={actionBtn}></ImgItem>}
  >
    {
      fileList.length < maxLength && <UploadBtn uploadType={1} text={uploadBtnText} disabled={disabled} itemWidth={itemWidth} />
    }
  </Upload >
}

export default Upload1