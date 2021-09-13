import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { Modal, } from 'antd';
import Crop from '@/components/crop'
import { CropProps } from '@/components/crop/data'
import { UploadFile } from 'antd/lib/upload/interface';
interface Props {
  cropVisible: boolean
  cropProps: CropProps
  cropUrl: string | undefined // 需要裁剪的url
  handleCropSuccess: (uid: string, previewUrl: string) => void
  handleCropClose: () => void
}

const CropModal: FC<Props> = (prop) => {
  const { cropVisible, handleCropClose, cropProps, cropUrl, handleCropSuccess } = prop
  return <Modal
    width={1220}
    title="裁剪图片"
    visible={cropVisible}
    footer={null}
    maskClosable={false}
    onCancel={handleCropClose}
  >
    <Crop cropProps={cropProps} url={cropUrl} handleCropSuccess={handleCropSuccess}></Crop>
  </Modal>
}

export default CropModal
