import React, { FC, useEffect, useMemo, useState, useRef } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styles from './index.less'
import { Button } from 'antd';
import { errorMessage } from '../message';
import { upImageToYoupai } from '@/api/common'
const test5 = require('../../../assets/img/test5.jpg')
interface Props {
  url: string,
  handleCropSuccess: (uid: string) => void
}

const Crop: FC<Props> = (props) => {
  const { url, handleCropSuccess } = props
  const [cropper, setCropper] = useState<Cropper>();
  // 保留裁剪下的数据

  // 确认裁剪
  const handleConfirmCropper = async () => {
    if (!cropper) {
      return
    }
    cropper.getCroppedCanvas().toBlob(async (blob) => {
      // 创建formData数据,因为图片上传的请求支持格式
      if (!blob) return
      console.log(blob)
      const suffix = blob?.type.split('/')[1] || 'png'
      const formData = new FormData()
      formData.append('file', blob, `${new Date().getDate()}-${Math.random()}.${suffix}`)
      formData.append('policy', window.__upyunImgConfig?.uploadParams?.policy)
      formData.append('signature', window.__upyunImgConfig?.uploadParams?.signature)
      console.log(formData.getAll("policy"))
      console.log(formData.getAll("signature"))
      console.log(formData.getAll("file"))
      const res = await upImageToYoupai(formData)
      console.log(res)
    }/*, 'image/png' */);

  };



  const upLoadImage = () => {

  }

  return <div className={styles["crop-container"]}>
    <div className={styles["crop-content"]}>
      <Cropper
        src={test5}
        style={{ width: 800, height: 600 }}
        aspectRatio={1 / 1}
        preview={`.${styles["img-preview"]}`}
        guides={true}
        autoCropArea={0.8}
        movable={true} // 是否允许移动图片
        zoomTo={2}
        viewMode={2}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        cropBoxResizable={true}
        cropBoxMovable={true}
        dragMode='move'
        checkOrientation={true}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
      />
    </div>
    <div className={styles["crop-preview"]}>
      <div className={styles["title"]}>图片预览</div>
      <div className={styles["preview-box"]}>
        <div className={styles["img-preview"]} />
      </div>
      <Button size="large" type="primary" onClick={handleConfirmCropper}>确认裁剪</Button>
    </div>

  </div>
}
export default Crop